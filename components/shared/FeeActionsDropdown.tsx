"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Printer,
  MessageSquare,
  History,
  CreditCard,
  CalendarClock,
} from "lucide-react";

interface FeeActionsDropdownProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDownload?: () => void;
  onPrint?: () => void;
  onMessage?: () => void;
  onViewHistory?: () => void;
  onRecordPayment?: () => void;
  onAutoReminder?: () => void;
  hasPayments?: boolean;
}

export default function FeeActionsDropdown({
  onEdit,
  onDelete,
  onDownload,
  onPrint,
  onMessage,
  onViewHistory,
  onRecordPayment,
  onAutoReminder,
  hasPayments = false,
}: FeeActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({
    position: "fixed",
    visibility: "hidden",
    top: 0,
    left: 0,
    zIndex: 99999,
  });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Track if component is mounted (for portal)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate dropdown position
  const calculatePosition = (): React.CSSProperties => {
    if (!buttonRef.current || typeof window === "undefined") {
      return {
        position: "fixed",
        visibility: "hidden",
        top: 0,
        left: 0,
        zIndex: 99999,
      };
    }

    const rect = buttonRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const dropdownHeight = 300; // Estimated max height for menu
    const dropdownWidth = 192;

    // Determine if we should open upward
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < dropdownHeight && spaceAbove > spaceBelow;

    // Calculate left position (align to right edge of button)
    let left = rect.right - dropdownWidth;
    if (left < 8) left = 8;
    if (left + dropdownWidth > viewportWidth - 8) {
      left = viewportWidth - dropdownWidth - 8;
    }

    // Calculate vertical position
    if (openUpward) {
      // Position above the button using bottom positioning
      const bottom = viewportHeight - rect.top + 4;
      return {
        position: "fixed",
        visibility: "visible",
        bottom: `${bottom}px`,
        left: `${left}px`,
        zIndex: 99999,
      };
    } else {
      // Position below the button
      const top = rect.bottom + 4;
      return {
        position: "fixed",
        visibility: "visible",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 99999,
      };
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      // Calculate position BEFORE opening and set both states
      const newStyle = calculatePosition();
      setDropdownStyle(newStyle);
    }
    setIsOpen(!isOpen);
  };

  // Close dropdown on scroll (since fixed position doesn't follow scroll)
  useEffect(() => {
    if (!isOpen) return;

    const handleScroll = () => {
      setIsOpen(false);
    };

    // Listen on window and any scrollable parent
    window.addEventListener("scroll", handleScroll, true);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node | null;
      if (!targetNode) return;

      const clickedButton = !!buttonRef.current?.contains(targetNode);
      const clickedDropdown = !!dropdownRef.current?.contains(targetNode);

      if (!clickedButton && !clickedDropdown) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Delay adding the listener to avoid catching the same click that opened the menu
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isOpen]);

  const handleAction = (action: (() => void) | undefined) => {
    if (action) {
      action();
    }
    setIsOpen(false);
  };

  const menuItems = [
    {
      id: "edit",
      label: "Edit Record",
      icon: <Edit className="w-4 h-4" />,
      onClick: onEdit,
      color: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
      show: !!onEdit,
    },
    {
      id: "payment",
      label: "Record Payment",
      icon: <CreditCard className="w-4 h-4" />,
      onClick: onRecordPayment,
      color: "text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30",
      show: !!onRecordPayment,
    },
    {
      id: "history",
      label: "Payment History",
      icon: <History className="w-4 h-4" />,
      onClick: onViewHistory,
      color: "text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30",
      show: !!onViewHistory && hasPayments,
    },
    {
      id: "message",
      label: "Send Message",
      icon: <MessageSquare className="w-4 h-4" />,
      onClick: onMessage,
      color: "text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30",
      show: !!onMessage,
    },
    {
      id: "autoReminder",
      label: "Auto Reminders",
      icon: <CalendarClock className="w-4 h-4" />,
      onClick: onAutoReminder,
      color: "text-orange-700 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/30",
      show: !!onAutoReminder,
    },
    {
      id: "divider1",
      type: "divider",
      show: (!!onEdit || !!onRecordPayment || !!onViewHistory || !!onMessage || !!onAutoReminder) && (!!onDownload || !!onPrint),
    },
    {
      id: "download",
      label: "Download Statement",
      icon: <Download className="w-4 h-4" />,
      onClick: onDownload,
      color: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
      show: !!onDownload,
    },
    {
      id: "print",
      label: "Print Statement",
      icon: <Printer className="w-4 h-4" />,
      onClick: onPrint,
      color: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
      show: !!onPrint,
    },
    {
      id: "divider2",
      type: "divider",
      show: !!onDelete && (!!onDownload || !!onPrint || !!onEdit || !!onRecordPayment),
    },
    {
      id: "delete",
      label: "Delete Record",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete,
      color: "text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30",
      show: !!onDelete,
    },
  ];

  const visibleItems = menuItems.filter((item) => item.show);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      {/* Dropdown Menu - Rendered via Portal */}
      {isMounted && isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            style={dropdownStyle}
            className="w-48 max-h-[320px] overflow-y-auto bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-1 animate-in fade-in zoom-in-95 duration-150"
          >
            {visibleItems.map((item) => {
              if (item.type === "divider") {
                return (
                  <div
                    key={item.id}
                    className="my-1 border-t border-gray-200 dark:border-gray-700"
                  />
                );
              }

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleAction(item.onClick)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${item.color}`}
                >
                  {item.icon}
                  {item.label}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </>
  );
}
