"use client";

import { X, AlertTriangle, Search, ArrowUpAZ, ArrowDownZA, Undo2, type LucideIcon } from "lucide-react";
import { useEffect, useState, useRef, type ReactNode } from "react";

export interface BulkDeleteItem {
  id: string;
  name: string;
  subtitle?: string;
  avatarColor?: string;
  avatar?: string;
  badge?: string;
  badgeColor?: "red" | "green" | "blue" | "orange" | "purple" | "gray";
}

export interface BulkDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (itemIds: string[]) => void;
  items: BulkDeleteItem[];
  onRemoveItem: (itemId: string) => void;
  onRestoreItem?: (item: BulkDeleteItem) => void;
  onRestoreAll?: (items: BulkDeleteItem[]) => void;
  // Customization props
  title?: string;
  subtitle?: string | ReactNode;
  headerIcon?: LucideIcon;
  headerColor?: "red" | "orange" | "blue" | "purple";
  warningMessage?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  searchPlaceholder?: string;
  emptyStateText?: string;
  noMatchText?: string;
  itemsLabel?: string;
}

// Color configurations for header
const headerColorConfig = {
  red: {
    bg: "bg-red-50 dark:bg-red-900/20 midnight:bg-red-900/20 purple:bg-red-900/20",
    border: "border-red-100 dark:border-red-800/30 midnight:border-red-700/30 purple:border-red-700/30",
    iconBg: "bg-red-500 dark:bg-red-600 midnight:bg-red-600 purple:bg-red-600",
    iconPing: "bg-red-500 dark:bg-red-400",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-900/20 midnight:bg-orange-900/20 purple:bg-orange-900/20",
    border: "border-orange-100 dark:border-orange-800/30 midnight:border-orange-700/30 purple:border-orange-700/30",
    iconBg: "bg-orange-500 dark:bg-orange-600 midnight:bg-orange-600 purple:bg-orange-600",
    iconPing: "bg-orange-500 dark:bg-orange-400",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-900/20 purple:bg-blue-900/20",
    border: "border-blue-100 dark:border-blue-800/30 midnight:border-blue-700/30 purple:border-blue-700/30",
    iconBg: "bg-blue-500 dark:bg-blue-600 midnight:bg-blue-600 purple:bg-blue-600",
    iconPing: "bg-blue-500 dark:bg-blue-400",
  },
  purple: {
    bg: "bg-purple-50 dark:bg-purple-900/20 midnight:bg-purple-900/20 purple:bg-purple-900/20",
    border: "border-purple-100 dark:border-purple-800/30 midnight:border-purple-700/30 purple:border-purple-700/30",
    iconBg: "bg-purple-500 dark:bg-purple-600 midnight:bg-purple-600 purple:bg-purple-600",
    iconPing: "bg-purple-500 dark:bg-purple-400",
  },
};

// Badge color configurations
const badgeColorConfig = {
  red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
  green: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  gray: "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
};

export default function BulkDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  items,
  onRemoveItem,
  onRestoreItem,
  onRestoreAll,
  title = "Delete Items",
  subtitle,
  headerIcon: HeaderIcon = AlertTriangle,
  headerColor = "red",
  warningMessage = "This will permanently remove these items and all associated data. This action cannot be undone.",
  confirmButtonText = "Delete Items",
  cancelButtonText = "Cancel",
  searchPlaceholder = "Search items...",
  emptyStateText = "No items selected for deletion",
  noMatchText = "No items match your search",
  itemsLabel = "Items",
}: BulkDeleteModalProps) {
  const colors = headerColorConfig[headerColor];
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [initialItemCount, setInitialItemCount] = useState(0);
  const [removedItems, setRemovedItems] = useState<BulkDeleteItem[]>([]);
  const [showRemovedItems, setShowRemovedItems] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Scroll modal into view when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [isOpen]);

  // Track initial item count when modal opens
  useEffect(() => {
    if (isOpen) {
      setInitialItemCount(items.length);
    }
  }, [isOpen]);

  // Calculate removed count
  const removedCount = initialItemCount - items.length;

  // Filter items based on search query
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered items
  const sortedAndFilteredItems = [...filteredItems].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.name.localeCompare(b.name);
    } else {
      return b.name.localeCompare(a.name);
    }
  });

  // Toggle sort order
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Reset search, sort, and removed items when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
      setSortOrder("asc");
      setRemovedItems([]);
      setShowRemovedItems(false);
    }
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm(items.map((item) => item.id));
  };

  // Handle removing an item and track it
  const handleRemoveItem = (itemId: string) => {
    const itemToRemove = items.find(item => item.id === itemId);
    if (itemToRemove) {
      setRemovedItems(prev => [...prev, itemToRemove]);
    }
    onRemoveItem(itemId);
  };

  // Handle restoring a single item
  const handleRestoreItem = (item: BulkDeleteItem) => {
    setRemovedItems(prev => prev.filter(i => i.id !== item.id));
    if (onRestoreItem) {
      onRestoreItem(item);
    }
  };

  // Handle restoring all items
  const handleRestoreAll = () => {
    if (onRestoreAll && removedItems.length > 0) {
      onRestoreAll(removedItems);
      setRemovedItems([]);
      setShowRemovedItems(false);
    }
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[calc(100vh-3rem)] sm:max-h-[calc(100vh-4rem)] flex flex-col animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`${colors.bg} px-6 pt-4 pb-3 rounded-t-2xl border-b ${colors.border} flex-shrink-0`}>
          <div className="flex justify-center mb-2">
            {/* Icon with animated rings */}
            <div className="relative">
              <div className={`absolute inset-0 ${colors.iconPing} rounded-full opacity-20 animate-ping`}></div>
              <div className={`relative w-9 h-9 ${colors.iconBg} rounded-full flex items-center justify-center`}>
                <HeaderIcon className="w-4.5 h-4.5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>
          <h2 className="text-sm font-bold text-center text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-center text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pt-4 pb-6 overflow-y-auto flex-1">
          {/* Warning Message */}
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/10 midnight:bg-red-900/10 purple:bg-red-900/10 border-l-4 border-red-500 dark:border-red-600 midnight:border-red-600 purple:border-red-600 rounded">
            <p className="text-sm text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
              {warningMessage}
            </p>
          </div>

          {/* Search Field */}
          {items.length >= 10 && (
            <div className="mb-4 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 midnight:text-cyan-500 purple:text-pink-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full pl-10 pr-4 py-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-gray-100 midnight:text-cyan-100 purple:text-pink-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 midnight:focus:ring-cyan-500 purple:focus:ring-pink-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          )}

          {/* Items List Header with Sort and Removed Count */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                {itemsLabel} to delete ({filteredItems.length} of {items.length}):
              </p>
              {/* Removed Count Badge */}
              {removedCount > 0 && (
                <button
                  onClick={() => setShowRemovedItems(!showRemovedItems)}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400 border border-green-300 dark:border-green-700 midnight:border-green-600 purple:border-green-600 hover:bg-green-200 dark:hover:bg-green-900/40 midnight:hover:bg-green-900/40 purple:hover:bg-green-900/40 transition-all duration-200 cursor-pointer active:scale-95"
                  title="Click to view removed items"
                >
                  {removedCount} removed
                </button>
              )}
            </div>

            {/* Sort Buttons - Only show when more than 1 item */}
            {items.length > 1 && (
              <button
                onClick={toggleSortOrder}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 transition-all duration-200 active:scale-95"
                title={sortOrder === "asc" ? "Sort Z to A" : "Sort A to Z"}
              >
                {sortOrder === "asc" ? (
                  <>
                    <ArrowUpAZ className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">A-Z</span>
                  </>
                ) : (
                  <>
                    <ArrowDownZA className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Z-A</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Items List */}
          <div className="space-y-2">
            <div className={`${showRemovedItems && removedItems.length > 0 ? 'max-h-[180px]' : 'max-h-[280px]'} overflow-y-auto space-y-2 pr-1 custom-scrollbar`}>
              {sortedAndFilteredItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/20 purple:border-pink-500/20 group hover:border-red-300 dark:hover:border-red-600 midnight:hover:border-red-500 purple:hover:border-red-500 transition-all duration-200"
                >
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 overflow-hidden"
                    style={{
                      backgroundColor: item.avatar ? 'transparent' : (item.avatarColor || "#3B82F6"),
                    }}
                  >
                    {item.avatar ? (
                      <img
                        src={item.avatar}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      getInitials(item.name)
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 truncate">
                        {item.name}
                      </p>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium border ${badgeColorConfig[item.badgeColor || "gray"]}`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {item.subtitle && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate">
                        {item.subtitle}
                      </p>
                    )}
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center bg-white dark:bg-gray-600 midnight:bg-gray-700 purple:bg-gray-700 border border-gray-300 dark:border-gray-500 midnight:border-cyan-500/30 purple:border-pink-500/30 text-gray-500 dark:text-gray-300 midnight:text-cyan-400 purple:text-pink-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 hover:border-red-300 dark:hover:border-red-600 midnight:hover:border-red-500 purple:hover:border-red-500 hover:text-red-600 dark:hover:text-red-400 midnight:hover:text-red-400 purple:hover:text-red-400 transition-all duration-200 flex-shrink-0 cursor-pointer"
                    title="Remove from list"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Removed Items Panel */}
          {showRemovedItems && removedItems.length > 0 && (
            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/10 midnight:bg-green-900/10 purple:bg-green-900/10 border border-green-300 dark:border-green-700 midnight:border-green-600 purple:border-green-600 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400">
                  Removed Items ({removedItems.length})
                </h3>
                <button
                  onClick={handleRestoreAll}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-green-300 dark:border-green-600 midnight:border-green-500 purple:border-green-500 hover:bg-green-100 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 active:scale-95"
                  title="Restore all removed items"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Restore All</span>
                </button>
              </div>

              <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {removedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-white dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-green-200 dark:border-green-600 midnight:border-green-500 purple:border-green-500"
                  >
                    {/* Avatar */}
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 opacity-70 overflow-hidden"
                      style={{
                        backgroundColor: item.avatar ? 'transparent' : (item.avatarColor || "#3B82F6"),
                      }}
                    >
                      {item.avatar ? (
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        getInitials(item.name)
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100 truncate">
                        {item.name}
                      </p>
                      {item.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    {/* Restore Button */}
                    <button
                      onClick={() => handleRestoreItem(item)}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-xs font-medium text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400 bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 border border-green-300 dark:border-green-600 midnight:border-green-500 purple:border-green-500 hover:bg-green-200 dark:hover:bg-green-900/40 midnight:hover:bg-green-900/40 purple:hover:bg-green-900/40 transition-all duration-200 cursor-pointer active:scale-95 flex-shrink-0"
                      title="Restore this item"
                    >
                      <Undo2 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Restore</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {items.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                {emptyStateText}
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                {noMatchText}
              </p>
            </div>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 pt-4 flex items-center justify-end gap-3 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 flex-shrink-0 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 bg-white dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-50 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 active:scale-95 cursor-pointer"
          >
            {cancelButtonText}
          </button>
          <button
            onClick={handleConfirm}
            disabled={items.length === 0}
            className="px-5 py-2.5 rounded-lg font-semibold text-sm text-white bg-red-600 dark:bg-red-600 midnight:bg-red-600 purple:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 midnight:hover:bg-red-700 purple:hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-red-600 transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl"
          >
            {confirmButtonText}
          </button>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}
