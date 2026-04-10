"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import {
  X, FolderOpen, Folder, ChevronRight, ChevronDown, FolderPlus,
  Move, Loader2, Check, AlertCircle, Lock, Home, Search,
  FileText, Presentation, Table2, Image as ImageIcon, File, HardDrive,
  FolderInput, Plus,
} from "lucide-react";
import { driveStorage, type DriveItem } from "@/lib/drive-storage";

// ── Types ──

export interface MoveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileId?: string;
  sourceId?: string;
  sourceType?: DriveItem["sourceType"];
  onMoveComplete?: (result: { oldFolder: string; newFolder: string }) => void;
}

// ── Helpers ──

function getSourceIcon(sourceType?: DriveItem["sourceType"], className = "w-5 h-5") {
  switch (sourceType) {
    case "presentation": return <Presentation className={`${className} text-orange-500`} />;
    case "document": return <FileText className={`${className} text-blue-500`} />;
    case "spreadsheet": return <Table2 className={`${className} text-green-500`} />;
    case "upload": return <ImageIcon className={`${className} text-purple-500`} />;
    default: return <File className={`${className} text-gray-400`} />;
  }
}

function getFolderColor(name: string): string {
  const map: Record<string, string> = {
    "My Drive": "text-blue-500",
    "Documents": "text-blue-500",
    "Presentations": "text-orange-500",
    "Spreadsheets": "text-green-500",
    "Images": "text-purple-500",
  };
  return map[name] || "text-amber-500";
}

function getFolderBg(name: string, isSelected: boolean): string {
  if (!isSelected) return "";
  const map: Record<string, string> = {
    "Documents": "bg-blue-500/8",
    "Presentations": "bg-orange-500/8",
    "Spreadsheets": "bg-green-500/8",
    "Images": "bg-purple-500/8",
  };
  return map[name] || "bg-blue-500/8";
}

// ── Folder Tree Node ──

interface FolderNodeProps {
  item: DriveItem;
  selectedId: string | null;
  expandedIds: Set<string>;
  disabledIds: Set<string>;
  currentParentId: string;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
  depth: number;
  searchQuery: string;
}

function FolderNode({ item, selectedId, expandedIds, disabledIds, currentParentId, onSelect, onToggle, depth, searchQuery }: FolderNodeProps) {
  const isExpanded = expandedIds.has(item.id);
  const isSelected = selectedId === item.id;
  const isDisabled = disabledIds.has(item.id);
  const isCurrent = item.id === currentParentId;
  const children = driveStorage.getFolders(item.id);
  const hasChildren = children.length > 0;
  const folderColor = getFolderColor(item.name);

  // Filter children if searching
  const filteredChildren = searchQuery
    ? children.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : children;

  // When searching, auto-expand if any child matches
  const shouldShow = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase()) || filteredChildren.length > 0;
  if (!shouldShow) return null;

  const isRoot = item.id === "folder-my-drive";

  return (
    <div className={isRoot ? "" : "ml-1"}>
      <button
        onClick={() => {
          if (isDisabled) return;
          onSelect(item.id);
          if (hasChildren && !isExpanded) onToggle(item.id);
        }}
        disabled={isDisabled}
        className={`
          group w-full flex items-center gap-2.5 px-3 py-[9px] rounded-xl text-left transition-all duration-150 cursor-pointer relative
          ${isSelected
            ? `${getFolderBg(item.name, true)} ring-[1.5px] ring-blue-400/60 dark:ring-blue-500/50 midnight:ring-cyan-500/50 purple:ring-pink-500/50`
            : isDisabled
              ? "opacity-35 cursor-not-allowed"
              : "hover:bg-gray-50 dark:hover:bg-white/[0.03]"
          }
        `}
        style={{ paddingLeft: `${depth * 24 + 12}px` }}
      >
        {/* Expand/collapse */}
        {hasChildren ? (
          <span
            className="w-5 h-5 flex items-center justify-center flex-shrink-0 rounded-md hover:bg-gray-200/60 dark:hover:bg-white/10 transition-colors"
            onClick={(e) => { e.stopPropagation(); onToggle(item.id); }}
          >
            {isExpanded
              ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            }
          </span>
        ) : (
          <span className="w-5 h-5 flex-shrink-0" />
        )}

        {/* Folder icon with colored background */}
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors
          ${isSelected
            ? "bg-blue-100 dark:bg-blue-500/20"
            : "bg-gray-100 dark:bg-white/5"
          }
        `}>
          {isRoot ? (
            <HardDrive className={`w-4 h-4 ${isSelected ? "text-blue-500" : "text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"}`} />
          ) : isExpanded ? (
            <FolderOpen className={`w-4 h-4 ${isSelected ? "text-blue-500" : folderColor}`} />
          ) : (
            <Folder className={`w-4 h-4 ${isSelected ? "text-blue-500" : folderColor}`} />
          )}
        </div>

        {/* Name + info */}
        <div className="flex-1 min-w-0">
          <span className={`text-[13px] leading-tight block truncate ${
            isSelected
              ? "font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50"
              : isDisabled
                ? "text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400"
                : "text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 group-hover:text-gray-900 dark:group-hover:text-white"
          }`}>
            {item.name}
          </span>
          {isRoot && !isSelected && (
            <span className="text-[10px] text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 leading-tight">
              {driveStorage.getFolders(item.id).length} folders
            </span>
          )}
        </div>

        {/* Badges */}
        {isCurrent && (
          <span className="text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/15 text-blue-500 flex-shrink-0">
            Current
          </span>
        )}
        {item.readOnly && (
          <Lock className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 flex-shrink-0" />
        )}
      </button>

      {/* Children */}
      {(isExpanded || searchQuery) && (hasChildren || filteredChildren.length > 0) && (
        <div className="relative">
          <div
            className="absolute top-0 bottom-0 w-px bg-gray-100 dark:bg-white/5"
            style={{ left: `${depth * 24 + 22}px` }}
          />
          {(searchQuery ? filteredChildren : children).map(child => (
            <FolderNode
              key={child.id}
              item={child}
              selectedId={selectedId}
              expandedIds={expandedIds}
              disabledIds={disabledIds}
              currentParentId={currentParentId}
              onSelect={onSelect}
              onToggle={onToggle}
              depth={depth + 1}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Snackbar ──

function Snackbar({ message, type, onDismiss }: { message: string; type: "success" | "error"; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 4500);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div className={`
      fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl shadow-black/20
      animate-in slide-in-from-bottom-4 fade-in duration-300
      ${type === "success"
        ? "bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900"
        : "bg-red-600 text-white"
      }
    `}>
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
        type === "success" ? "bg-green-500/20" : "bg-white/20"
      }`}>
        {type === "success"
          ? <Check className="w-3.5 h-3.5 text-green-400 dark:text-green-600" />
          : <AlertCircle className="w-3.5 h-3.5" />
        }
      </div>
      <span className="text-[13px] font-medium">{message}</span>
      <button onClick={onDismiss} className="ml-1 p-1 rounded-full hover:bg-white/10 dark:hover:bg-black/10 transition-colors cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ── Main Component ──

export default function MoveDialog({
  isOpen,
  onClose,
  fileName,
  fileId,
  sourceId,
  sourceType,
  onMoveComplete,
}: MoveDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["folder-my-drive"]));
  const [isMoving, setIsMoving] = useState(false);
  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const newFolderInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const [driveItem, setDriveItem] = useState<DriveItem | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (fileId) {
      setDriveItem(driveStorage.get(fileId));
    } else if (sourceId && sourceType) {
      const item = driveStorage.ensureFileEntry(sourceId, fileName, sourceType);
      setDriveItem(item);
    }
  }, [isOpen, fileId, sourceId, sourceType, fileName]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFolderId(null);
      setSearchQuery("");
      setIsCreatingFolder(false);
      setNewFolderName("");
    }
  }, [isOpen]);

  const currentParentId = driveItem?.parentId || "root";

  const disabledIds = useMemo(() => {
    const ids = new Set<string>();
    const allItems = driveStorage.list();
    allItems.forEach(i => { if (i.readOnly) ids.add(i.id); });
    ids.add(currentParentId);
    if (driveItem) {
      ids.add(driveItem.id);
      if (driveItem.type === "folder") {
        const descendants = new Set<string>();
        const queue = [driveItem.id];
        while (queue.length) {
          const cur = queue.shift()!;
          for (const it of allItems) {
            if (it.parentId === cur && !descendants.has(it.id)) {
              descendants.add(it.id);
              if (it.type === "folder") queue.push(it.id);
            }
          }
        }
        descendants.forEach(id => ids.add(id));
      }
    }
    return ids;
  }, [driveItem, currentParentId]);

  const rootFolders = useMemo(() => {
    return driveStorage.getFolders("root").filter(f => !f.readOnly);
  }, []);

  const isValidSelection = selectedFolderId !== null && !disabledIds.has(selectedFolderId);

  // Get selected folder info for the footer hint
  const selectedFolder = selectedFolderId ? driveStorage.get(selectedFolderId) : null;

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  const handleMove = async () => {
    if (!driveItem || !selectedFolderId) return;
    setIsMoving(true);
    await new Promise(r => setTimeout(r, 500));
    const result = driveStorage.move(driveItem.id, selectedFolderId);
    setIsMoving(false);

    if (result.success) {
      driveStorage.notifyChange();
      setSnackbar({ message: `Moved "${fileName}" to ${result.newParentName}`, type: "success" });
      onMoveComplete?.({ oldFolder: result.oldParentName!, newFolder: result.newParentName! });
      setTimeout(onClose, 700);
    } else {
      setSnackbar({ message: result.error || "Move failed", type: "error" });
    }
  };

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return;
    const parentId = selectedFolderId || "folder-my-drive";
    const id = driveStorage.createFolder(parentId, newFolderName.trim());
    setExpandedIds(prev => new Set([...prev, parentId]));
    setSelectedFolderId(id);
    setNewFolderName("");
    setIsCreatingFolder(false);
  };

  if (!isOpen) return null;

  // Build breadcrumb for current location
  const currentPath = driveStorage.getPath(currentParentId);

  return (
    <>
      <div className="fixed inset-0 z-[9000] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

        <div className="relative z-10 w-[520px] max-w-[94vw] bg-white dark:bg-[#1a1a2e] midnight:bg-[#0d1321] purple:bg-[#1a0f29] rounded-2xl shadow-2xl shadow-black/30 flex flex-col overflow-hidden animate-in zoom-in-[0.97] slide-in-from-bottom-3 duration-200">

          {/* ── Header ── */}
          <div className="px-6 pt-5 pb-4">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[14px] bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <FolderInput className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[16px] font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">Move to</h2>
                  <p className="text-[12px] text-gray-400 mt-0.5">Choose a destination folder</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 -mr-1 -mt-1 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer">
                <X className="w-4 h-4 text-gray-400" />
              </button>
            </div>

            {/* File being moved */}
            <div className="flex items-center gap-3 px-3.5 py-3 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06]">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-white/10 border border-gray-100 dark:border-white/[0.08] flex items-center justify-center shadow-sm">
                {getSourceIcon(sourceType, "w-4.5 h-4.5")}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 truncate">{fileName}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Home className="w-3 h-3 text-gray-300 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400" />
                  <p className="text-[11px] text-gray-400 truncate">
                    {currentPath.map(p => p.name).join(" / ") || "My Drive"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Search ── */}
          <div className="px-6 pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search folders..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-gray-50 dark:bg-white/[0.04] border border-gray-100 dark:border-white/[0.06] text-[13px] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400/30 focus:border-blue-300 dark:focus:border-blue-500 midnight:focus:border-cyan-500 purple:focus:border-pink-500/30 transition-all"
              />
            </div>
          </div>

          {/* ── Folder tree ── */}
          <div className="flex-1 overflow-y-auto px-4 pb-3 min-h-[200px] max-h-[320px]">
            {rootFolders.map(folder => (
              <FolderNode
                key={folder.id}
                item={folder}
                selectedId={selectedFolderId}
                expandedIds={expandedIds}
                disabledIds={disabledIds}
                currentParentId={currentParentId}
                onSelect={setSelectedFolderId}
                onToggle={handleToggle}
                depth={0}
                searchQuery={searchQuery}
              />
            ))}

            {rootFolders.length === 0 && (
              <div className="text-center py-12">
                <div className="w-14 h-14 rounded-2xl bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-3">
                  <Folder className="w-6 h-6 text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500" />
                </div>
                <p className="text-[14px] font-medium text-gray-400">No folders yet</p>
                <p className="text-[12px] text-gray-300 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 mt-1">Create your first folder below</p>
              </div>
            )}
          </div>

          {/* ── New folder inline ── */}
          {isCreatingFolder && (
            <div className="mx-4 mb-3 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/15 flex items-center justify-center flex-shrink-0">
                  <FolderPlus className="w-4 h-4 text-blue-500" />
                </div>
                <input
                  ref={newFolderInputRef}
                  type="text"
                  value={newFolderName}
                  onChange={e => setNewFolderName(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleCreateFolder();
                    if (e.key === "Escape") { setIsCreatingFolder(false); setNewFolderName(""); }
                  }}
                  placeholder="Folder name"
                  autoFocus
                  className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-white/10 border border-gray-200 dark:border-white/10 text-[13px] text-gray-800 dark:text-gray-200 midnight:text-cyan-100 purple:text-pink-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-400/40 transition-all"
                />
                <button
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
                  className="px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white bg-blue-500 hover:bg-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-sm"
                >
                  Add
                </button>
                <button
                  onClick={() => { setIsCreatingFolder(false); setNewFolderName(""); }}
                  className="p-1 rounded-md hover:bg-gray-200/60 dark:hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="w-3.5 h-3.5 text-gray-400" />
                </button>
              </div>
            </div>
          )}

          {/* ── Footer ── */}
          <div className="px-5 py-4 border-t border-gray-100 dark:border-white/[0.05] bg-gray-50/60 dark:bg-white/[0.02]">
            {/* Destination hint */}
            {isValidSelection && selectedFolder && (
              <div className="flex items-center gap-1.5 mb-3 px-1">
                <span className="text-[11px] text-gray-400">Moving to:</span>
                <div className="flex items-center gap-1">
                  <Folder className={`w-3 h-3 ${getFolderColor(selectedFolder.name)}`} />
                  <span className="text-[11px] font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{selectedFolder.name}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              <button
                onClick={() => { setIsCreatingFolder(true); setTimeout(() => newFolderInputRef.current?.focus(), 50); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                New folder
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-[13px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMove}
                  disabled={!isValidSelection || isMoving}
                  className={`
                    flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 cursor-pointer
                    ${isValidSelection && !isMoving
                      ? "text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 active:scale-[0.98]"
                      : "text-gray-400 dark:text-gray-600 midnight:text-cyan-500 purple:text-pink-500 bg-gray-100 dark:bg-white/5 cursor-not-allowed"
                    }
                  `}
                >
                  {isMoving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Moving...
                    </>
                  ) : (
                    <>
                      <Move className="w-4 h-4" />
                      Move here
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {snackbar && (
        <Snackbar
          message={snackbar.message}
          type={snackbar.type}
          onDismiss={() => setSnackbar(null)}
        />
      )}
    </>
  );
}
