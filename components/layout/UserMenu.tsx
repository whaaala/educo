"use client";

import { useState, useEffect, useRef } from "react";
import { User, Settings, LogOut } from "lucide-react";
import Image from "next/image";

interface UserMenuProps {
  userName?: string;
  userRole?: string;
  userAvatar?: string;
}

export default function UserMenu({
  userName = "Kevin Larry",
  userRole = "Administrator",
  userAvatar,
}: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuItemClick = (action: string) => {
    setIsOpen(false);
    // Handle navigation or actions here
    console.log(`Navigating to: ${action}`);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button - Just Avatar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#252930] midnight:hover:bg-[#1a3a52] purple:hover:bg-[#3d1f5c] transition-colors duration-200 focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={36}
              height={36}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-semibold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-xl border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 z-50 transition-colors duration-300"
          role="menu"
          aria-orientation="vertical"
        >
          {/* Profile Card Section */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-3">
              {/* Avatar in dropdown */}
              <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {userAvatar ? (
                  <Image
                    src={userAvatar}
                    alt={userName}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white font-semibold text-lg">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{userName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{userRole}</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => handleMenuItemClick("profile")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252930] midnight:hover:bg-[#1a3a52] purple:hover:bg-[#3d1f5c] transition-colors duration-150"
              role="menuitem"
            >
              <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => handleMenuItemClick("settings")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#252930] midnight:hover:bg-[#1a3a52] purple:hover:bg-[#3d1f5c] transition-colors duration-150"
              role="menuitem"
            >
              <Settings className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span>Settings</span>
            </button>

            {/* Divider */}
            <div className="my-2 border-t border-gray-100 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20"></div>

            {/* Logout */}
            <button
              onClick={() => handleMenuItemClick("logout")}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-150"
              role="menuitem"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
