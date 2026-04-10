"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Folder, FileText, Image, Film, Music, Archive, File,
  Upload, Download, Share2, Trash2, FolderPlus, Search,
  ChevronRight, Grid, List, ArrowLeft, RefreshCw, X,
  MoreVertical, Link2, AlertTriangle, Cloud,
} from "lucide-react";
import { useStorage } from "@/contexts/StorageContext";
import type { StorageItem, StorageListResult } from "@/lib/services/storage/types";
import { StorageQuotaExceededError } from "@/lib/services/storage/errors";

// ── Props ──

export interface StorageBrowserProps {
  /** Root path to start browsing from */
  rootPath?: string;
  /** Callback when a file is selected */
  onFileSelect?: (item: StorageItem) => void;
  /** Callback after a file is uploaded */
  onFileUpload?: (item: StorageItem) => void;
  /** Browser mode: browse (full), pick (select file), save (save to location) */
  mode?: "browse" | "pick" | "save";
  /** Restrict to specific file types (e.g., [".pdf", ".doc"]) */
  allowedTypes?: string[];
  /** Show the toolbar with upload, search, etc. */
  showToolbar?: boolean;
  /** Custom class name for the container */
  className?: string;
  /** Current user ID for hybrid service */
  userId?: string;
}

// ── Helpers ──

function getFileIcon(name: string, type: "file" | "folder") {
  if (type === "folder") return <Folder className="w-5 h-5 text-blue-500" />;

  const ext = name.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"].includes(ext))
    return <Image className="w-5 h-5 text-green-500" />;
  if (["mp4", "mov", "avi", "mkv", "webm"].includes(ext))
    return <Film className="w-5 h-5 text-purple-500" />;
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(ext))
    return <Music className="w-5 h-5 text-pink-500" />;
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <Archive className="w-5 h-5 text-yellow-600" />;
  if (["pdf"].includes(ext))
    return <FileText className="w-5 h-5 text-red-500" />;
  if (["doc", "docx", "txt", "rtf", "odt"].includes(ext))
    return <FileText className="w-5 h-5 text-blue-600" />;
  if (["xls", "xlsx", "csv"].includes(ext))
    return <FileText className="w-5 h-5 text-green-600" />;
  if (["ppt", "pptx"].includes(ext))
    return <FileText className="w-5 h-5 text-orange-500" />;

  return <File className="w-5 h-5 text-gray-400" />;
}

function formatSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return d.toLocaleDateString();
}

/** Check if item is from Dropbox overflow */
function isDropboxItem(item: StorageItem): boolean {
  return item.id.startsWith("dropbox:");
}

export default function StorageBrowser({
  rootPath = "",
  onFileSelect,
  onFileUpload,
  mode = "browse",
  allowedTypes,
  showToolbar = true,
  className = "",
  userId = "anonymous",
}: StorageBrowserProps) {
  const {
    settings,
    isSupabaseConfigured: supabaseReady,
    supabaseQuotaUsed,
    supabaseQuotaTotal,
    refreshSupabaseQuota,
    getHybridService,
    connectDropboxOverflow,
    isDropboxOverflowConnected,
    getUserConnection,
  } = useStorage();

  const [currentPath, setCurrentPath] = useState(rootPath);
  const [items, setItems] = useState<StorageItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [contextMenu, setContextMenu] = useState<{ item: StorageItem; x: number; y: number } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [showOverflowPrompt, setShowOverflowPrompt] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check if we can use storage
  const connection = getUserConnection(userId);
  const hasDropboxOverflow = isDropboxOverflowConnected(userId);

  // Supabase is always "connected" if configured — no OAuth needed
  const isConnected = supabaseReady || (connection?.connected && connection.hasValidToken);

  // Quota percentage
  const quotaPercent = supabaseQuotaTotal > 0 ? (supabaseQuotaUsed / supabaseQuotaTotal) * 100 : 0;

  // Breadcrumb path segments
  const pathSegments = currentPath
    .split("/")
    .filter(Boolean)
    .map((segment, i, arr) => ({
      name: segment,
      path: "/" + arr.slice(0, i + 1).join("/"),
    }));

  // Load folder contents using hybrid service
  const loadFolder = useCallback(async (path: string) => {
    if (!isConnected) return;
    setIsLoading(true);
    setError(null);

    try {
      const hybridService = getHybridService(userId);
      if (!hybridService) {
        setError("Storage not available");
        return;
      }

      const result: StorageListResult = await hybridService.listFolder(path);

      let filteredItems = result.items;
      if (allowedTypes && allowedTypes.length > 0) {
        filteredItems = result.items.filter((item) => {
          if (item.type === "folder") return true;
          const ext = "." + (item.name.split(".").pop()?.toLowerCase() || "");
          return allowedTypes.includes(ext);
        });
      }

      // Sort: folders first, then by name
      filteredItems.sort((a, b) => {
        if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
        return a.name.localeCompare(b.name);
      });

      setItems(filteredItems);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load folder");
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, getHybridService, userId, allowedTypes]);

  // Load on mount and path change
  useEffect(() => {
    if (isConnected) {
      loadFolder(currentPath);
    }
  }, [currentPath, isConnected, loadFolder]);

  // Refresh quota on mount
  useEffect(() => {
    if (supabaseReady) {
      refreshSupabaseQuota();
    }
  }, [supabaseReady, refreshSupabaseQuota]);

  // Search
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim() || !isConnected) return;
    setIsSearching(true);
    setError(null);

    try {
      const hybridService = getHybridService(userId);
      if (!hybridService) return;

      const result = await hybridService.search(searchQuery, currentPath || undefined);
      setItems(result.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery, isConnected, getHybridService, userId, currentPath]);

  // Navigate to folder
  const navigateToFolder = useCallback((item: StorageItem) => {
    setSearchQuery("");
    setCurrentPath(item.path);
  }, []);

  // Navigate up
  const navigateUp = useCallback(() => {
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath(parts.length ? "/" + parts.join("/") : "");
  }, [currentPath]);

  // Handle item click
  const handleItemClick = useCallback((item: StorageItem) => {
    if (item.type === "folder") {
      navigateToFolder(item);
    } else {
      onFileSelect?.(item);
    }
  }, [navigateToFolder, onFileSelect]);

  // Upload file — uses hybrid service (Supabase primary, Dropbox overflow)
  const handleUpload = useCallback(async (files: FileList | File[]) => {
    if (!isConnected) return;

    const hybridService = getHybridService(userId);
    if (!hybridService) return;

    for (const file of Array.from(files)) {
      try {
        const result = await hybridService.upload({
          path: `${currentPath}/${file.name}`.replace(/\/+/g, "/"),
          file,
          autorename: true,
        });
        onFileUpload?.(result.item);
      } catch (err) {
        if (err instanceof StorageQuotaExceededError) {
          setShowOverflowPrompt(true);
          return; // Stop uploading, show prompt
        }
        console.error("Upload failed:", err);
      }
    }

    // Refresh folder and quota
    loadFolder(currentPath);
    refreshSupabaseQuota();
  }, [isConnected, getHybridService, userId, currentPath, onFileUpload, loadFolder, refreshSupabaseQuota]);

  // Create folder
  const handleCreateFolder = useCallback(async () => {
    if (!newFolderName.trim() || !isConnected) return;

    try {
      const hybridService = getHybridService(userId);
      if (!hybridService) return;

      await hybridService.createFolder(`${currentPath}/${newFolderName.trim()}`.replace(/\/+/g, "/"));
      setNewFolderName("");
      setShowNewFolder(false);
      loadFolder(currentPath);
    } catch (err) {
      console.error("Create folder failed:", err);
    }
  }, [newFolderName, isConnected, getHybridService, userId, currentPath, loadFolder]);

  // Delete item
  const handleDelete = useCallback(async (item: StorageItem) => {
    if (!confirm(`Delete "${item.name}"? This cannot be undone.`)) return;

    try {
      const hybridService = getHybridService(userId);
      if (!hybridService) return;

      await hybridService.deleteItem(item.path);
      loadFolder(currentPath);
      refreshSupabaseQuota();
    } catch (err) {
      console.error("Delete failed:", err);
    }
    setContextMenu(null);
  }, [getHybridService, userId, currentPath, loadFolder, refreshSupabaseQuota]);

  // Download item
  const handleDownload = useCallback(async (item: StorageItem) => {
    try {
      const hybridService = getHybridService(userId);
      if (!hybridService) return;

      const blob = await hybridService.download(item.path);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = item.name;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
    }
    setContextMenu(null);
  }, [getHybridService, userId]);

  // Share item
  const handleShare = useCallback(async (item: StorageItem) => {
    try {
      const hybridService = getHybridService(userId);
      if (!hybridService) return;

      const result = await hybridService.createSharedLink({ path: item.path, access: "viewer", linkOnly: true });
      await navigator.clipboard.writeText(result.sharedLink);
      alert("Shared link copied to clipboard!");
    } catch (err) {
      console.error("Share failed:", err);
    }
    setContextMenu(null);
  }, [getHybridService, userId]);

  // Drag & drop
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  }, [handleUpload]);

  // Close context menu on outside click
  useEffect(() => {
    const close = () => setContextMenu(null);
    if (contextMenu) {
      document.addEventListener("click", close);
      return () => document.removeEventListener("click", close);
    }
  }, [contextMenu]);

  // ── Not connected state ──
  if (!isConnected) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 px-6 text-center ${className}`}>
        <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] flex items-center justify-center mb-4">
          <Cloud className="w-6 h-6 text-gray-400" />
        </div>
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-1">
          Storage not configured
        </h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 max-w-xs">
          Configure Supabase in your environment variables to enable file storage, or connect a cloud storage account in Settings.
        </p>
      </div>
    );
  }

  // ── Main browser ──
  return (
    <div
      className={`flex flex-col bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Overflow prompt banner */}
      {showOverflowPrompt && (
        <div className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-500/10 border-b border-amber-200 dark:border-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Storage full
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 midnight:text-amber-400 purple:text-amber-400">
              {hasDropboxOverflow
                ? "Your platform storage is full. Files will be saved to Dropbox."
                : "Connect Dropbox for additional storage space."}
            </p>
          </div>
          {!hasDropboxOverflow && (
            <button
              onClick={() => connectDropboxOverflow(userId)}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-medium text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors cursor-pointer"
            >
              Connect Dropbox
            </button>
          )}
          <button
            onClick={() => setShowOverflowPrompt(false)}
            className="flex-shrink-0 p-1 rounded hover:bg-amber-200/50 dark:hover:bg-amber-500/20 cursor-pointer"
          >
            <X className="w-4 h-4 text-amber-500" />
          </button>
        </div>
      )}

      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
          {/* Back button */}
          <button
            onClick={navigateUp}
            disabled={!currentPath}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 disabled:opacity-30 transition-colors cursor-pointer"
            title="Go up"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
          </button>

          {/* Breadcrumbs */}
          <div className="flex items-center gap-1 flex-1 min-w-0 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 overflow-x-auto">
            <button
              onClick={() => setCurrentPath("")}
              className="hover:text-gray-700 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100 flex-shrink-0 cursor-pointer"
            >
              Root
            </button>
            {pathSegments.map((seg) => (
              <span key={seg.path} className="flex items-center gap-1 flex-shrink-0">
                <ChevronRight className="w-3 h-3" />
                <button
                  onClick={() => setCurrentPath(seg.path)}
                  className="hover:text-gray-700 dark:hover:text-gray-200 midnight:hover:text-cyan-100 purple:hover:text-pink-100 cursor-pointer"
                >
                  {seg.name}
                </button>
              </span>
            ))}
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="w-32 sm:w-40 px-2.5 py-1 pl-7 text-xs border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50"
            />
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          </div>

          {/* Actions */}
          <button
            onClick={() => setShowNewFolder(true)}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
            title="New folder"
          >
            <FolderPlus className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
            title="Upload file"
          >
            <Upload className="w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
          </button>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleUpload(e.target.files)}
          />

          {/* View toggle */}
          <div className="flex border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 transition-colors cursor-pointer ${viewMode === "list" ? "bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"}`}
            >
              <List className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 transition-colors cursor-pointer ${viewMode === "grid" ? "bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700" : "hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10"}`}
            >
              <Grid className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300" />
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={() => loadFolder(currentPath)}
            className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 ${isLoading ? "animate-spin" : ""}`} />
          </button>
        </div>
      )}

      {/* New folder input */}
      {showNewFolder && (
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-blue-50 dark:bg-blue-500/10">
          <FolderPlus className="w-4 h-4 text-blue-500" />
          <input
            type="text"
            placeholder="Folder name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateFolder()}
            autoFocus
            className="flex-1 px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-900 dark:text-gray-100 midnight:text-cyan-50 purple:text-pink-50"
          />
          <button onClick={handleCreateFolder} className="text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium cursor-pointer">Create</button>
          <button onClick={() => { setShowNewFolder(false); setNewFolderName(""); }} className="cursor-pointer">
            <X className="w-3.5 h-3.5 text-gray-400" />
          </button>
        </div>
      )}

      {/* Drag overlay */}
      {isDraggingOver && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-blue-50/80 dark:bg-blue-500/10 border-2 border-dashed border-blue-400 rounded-xl">
          <div className="text-center">
            <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">Drop files here to upload</p>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto min-h-[200px] max-h-[400px] relative">
        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Error */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <p className="text-xs text-red-500">{error}</p>
            <button
              onClick={() => loadFolder(currentPath)}
              className="mt-2 text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && items.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <Folder className="w-8 h-8 text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 mb-2" />
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
              {searchQuery ? "No results found" : "This folder is empty"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-2 text-xs text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer"
              >
                Upload a file
              </button>
            )}
          </div>
        )}

        {/* List view */}
        {!isLoading && !error && items.length > 0 && viewMode === "list" && (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10/50 transition-colors cursor-pointer group"
                onClick={() => handleItemClick(item)}
              >
                {getFileIcon(item.name, item.type)}
                <div className="flex-1 min-w-0 flex items-center gap-2">
                  <p className="text-sm text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{item.name}</p>
                  {/* Dropbox source badge */}
                  {isDropboxItem(item) && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0">
                      Dropbox
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 hidden sm:block">
                  {formatSize(item.size)}
                </span>
                <span className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 hidden sm:block w-20 text-right">
                  {formatDate(item.modifiedAt)}
                </span>
                {item.isShared && (
                  <Link2 className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
                )}
                {item.type === "file" && mode === "browse" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setContextMenu({ item, x: e.clientX, y: e.clientY });
                    }}
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <MoreVertical className="w-3.5 h-3.5 text-gray-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Grid view */}
        {!isLoading && !error && items.length > 0 && viewMode === "grid" && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 p-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center gap-1 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10/50 transition-colors cursor-pointer group relative"
                onClick={() => handleItemClick(item)}
              >
                <div className="w-10 h-10 flex items-center justify-center">
                  {getFileIcon(item.name, item.type)}
                </div>
                <p className="text-[11px] text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 text-center truncate w-full">
                  {item.name}
                </p>
                {/* Dropbox badge in grid */}
                {isDropboxItem(item) && (
                  <span className="text-[8px] px-1 py-0.5 rounded bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                    Dropbox
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Context menu */}
        {contextMenu && (
          <div
            className="fixed z-50 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-1 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              onClick={() => handleDownload(contextMenu.item)}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" /> Download
            </button>
            {settings.enableFileSharing && (
              <button
                onClick={() => handleShare(contextMenu.item)}
                className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 hover:bg-gray-100 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" /> Share link
              </button>
            )}
            <hr className="my-1 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20" />
            <button
              onClick={() => handleDelete(contextMenu.item)}
              className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Footer with quota bar */}
      <div className="px-3 py-1.5 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]/50 midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">
            {items.length} {items.length === 1 ? "item" : "items"}
            {currentPath ? ` in ${currentPath}` : " in root"}
          </p>

          {/* Supabase quota bar */}
          {supabaseReady && supabaseQuotaTotal > 0 && (
            <div className="flex items-center gap-2">
              <div className="w-20 h-1.5 rounded-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${quotaPercent > 90 ? "bg-red-500" : quotaPercent > 70 ? "bg-amber-500" : "bg-indigo-500"}`}
                  style={{ width: `${Math.min(100, quotaPercent)}%` }}
                />
              </div>
              <span className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">
                {formatSize(supabaseQuotaUsed)} / {formatSize(supabaseQuotaTotal)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
