"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { User, Settings, LogOut } from "lucide-react";
import Image from "next/image";
import MenuItem from "./MenuItem";
import MenuDivider from "./MenuDivider";

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
  const [isMounted, setIsMounted] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Track if component is mounted
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (isOpen && buttonRef.current && typeof window !== 'undefined') {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: 'fixed',
        top: `${rect.bottom + 8}px`,
        right: `${window.innerWidth - rect.right}px`,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      // Delay adding the listener to avoid catching the same click that opened the menu
      const timeoutId = setTimeout(() => {
        document.addEventListener("mousedown", handleClickOutside);
      }, 0);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
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
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#252930] midnight:hover:bg-[#1a3a52] purple:hover:bg-[#3d1f5c] transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-transparent hover:ring-blue-500/20 transition-all duration-200">
          {userAvatar ? (
            <Image
              src={userAvatar}
              alt={userName}
              width={36}
              height={36}
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 text-white font-bold text-xs sm:text-sm shadow-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </button>

      {/* Dropdown Menu - Rendered via Portal */}
      {isMounted && isOpen &&
        createPortal(
          <>
            {/* Overlay */}
            <div
              className="fixed inset-0 z-[100] bg-black/20"
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
            />

            <div
              style={dropdownStyle}
              className="w-72 bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-xl shadow-2xl border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 z-[9999] transition-colors duration-300 max-h-[500px] overflow-y-auto"
              role="menu"
              aria-orientation="vertical"
            >

            {/* Profile Card Section */}
            <div className="px-4 sm:px-5 py-4 sm:py-5 border-b border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gradient-to-br from-gray-50/50 to-transparent dark:from-gray-800/20">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Avatar in dropdown */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0 ring-2 ring-blue-500/10 shadow-lg">
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt={userName}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 text-white font-bold text-xl sm:text-2xl shadow-inner">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">{userName}</p>
                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 truncate mt-0.5">{userRole}</p>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 px-2">
              <MenuItem
                icon={User}
                label="My Profile"
                onClick={() => handleMenuItemClick("profile")}
              />

              <MenuItem
                icon={Settings}
                label="Settings"
                onClick={() => handleMenuItemClick("settings")}
              />

              <MenuDivider />

              <MenuItem
                icon={LogOut}
                label="Logout"
                onClick={() => handleMenuItemClick("logout")}
                variant="danger"
              />
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
