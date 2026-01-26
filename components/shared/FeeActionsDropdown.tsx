"use client";

import { useState, useEffect, useRef } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Download,
  Printer,
  MessageSquare,
  History,
  CreditCard,
  Copy,
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
  onCopyId?: () => void;
  recordId?: string;
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
  onCopyId,
  recordId,
  hasPayments = false,
}: FeeActionsDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Calculate dropdown position when opening
  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const dropdownHeight = 320; // Approximate max dropdown height

      // Open upward if not enough space below
      setOpenUpward(spaceBelow < dropdownHeight);
    }
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void | undefined) => {
    if (action) {
      action();
    }
    setIsOpen(false);
  };

  const handleCopyId = () => {
    if (recordId) {
      navigator.clipboard.writeText(recordId);
    }
    onCopyId?.();
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
      show: (!!onEdit || !!onRecordPayment || !!onViewHistory || !!onMessage || !!onAutoReminder) && (!!onDownload || !!onPrint || !!recordId),
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
      id: "copy",
      label: "Copy Record ID",
      icon: <Copy className="w-4 h-4" />,
      onClick: handleCopyId,
      color: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
      show: !!recordId,
    },
    {
      id: "divider2",
      type: "divider",
      show: !!onDelete && (!!onDownload || !!onPrint || !!recordId || !!onEdit || !!onRecordPayment),
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
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
      >
        <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className={`absolute right-0 w-48 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-1 z-[100] animate-in fade-in zoom-in-95 duration-150 ${openUpward ? "bottom-full mb-1" : "top-full mt-1"}`}>
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
                onClick={() => handleAction(item.onClick!)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium transition-colors cursor-pointer ${item.color}`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
