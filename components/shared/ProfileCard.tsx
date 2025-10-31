"use client";

import {
  Mail,
  Phone,
  MessageCircle,
  MoreVertical,
  LucideIcon,
  Eye,
  Edit,
  TrendingUp,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import CollectFeesModal from "./CollectFeesModal";

export interface ProfileDetail {
  label: string;
  value: string;
}

export interface ProfileAction {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
}

export interface ProfileCardProps {
  id: string;
  name: string;
  subtitle: string;
  status: "Active" | "Inactive";
  avatar?: string;
  details: ProfileDetail[];
  colorIndex: number;
  primaryAction?: {
    label: string;
    onClick?: () => void;
  };
  customActions?: ProfileAction[];
  onMenuClick?: () => void;
}

export default function ProfileCard({
  id,
  name,
  subtitle,
  status,
  avatar,
  details,
  colorIndex,
  primaryAction = { label: "Add Fees" },
  customActions,
  onMenuClick,
}: ProfileCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFeesModalOpen, setIsFeesModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarGradient = (index: number) => {
    const gradients = [
      "from-blue-500 to-cyan-500",
      "from-green-500 to-emerald-500",
      "from-purple-500 to-pink-500",
      "from-pink-500 to-rose-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-purple-500",
      "from-red-500 to-pink-500",
      "from-orange-500 to-amber-500",
    ];
    return gradients[index % gradients.length];
  };

  // Default actions
  const defaultActions: ProfileAction[] = [
    { icon: MessageCircle, label: "Send Message" },
    { icon: Phone, label: "Call" },
    { icon: Mail, label: "Send Email" },
  ];

  const actions = customActions || defaultActions;

  return (
    <div className="relative">
      <div
        className="group relative bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 hover:bg-gradient-to-br hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 dark:hover:bg-gray-800/90 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-blue-400/30 midnight:hover:shadow-cyan-400/30 purple:hover:shadow-pink-400/30 hover:border-purple-300/60 dark:hover:border-blue-400/50 midnight:hover:border-cyan-400/50 purple:hover:border-pink-400/50 hover:-translate-y-2 hover:scale-[1.02]"
        style={{ overflow: "visible" }}
      >
        {/* Gradient Overlay Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-pink-500/5 dark:from-blue-400/15 dark:via-purple-400/8 dark:to-pink-400/15 midnight:from-cyan-400/15 midnight:via-purple-400/8 midnight:to-cyan-400/15 purple:from-pink-400/15 purple:via-purple-400/8 purple:to-pink-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Animated Border Glow */}
        <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 dark:from-blue-400/40 dark:via-purple-400/40 dark:to-pink-400/40 midnight:from-cyan-400/40 midnight:via-purple-400/40 midnight:to-cyan-400/40 purple:from-pink-400/40 purple:via-purple-400/40 purple:to-pink-400/40 blur-md -z-10" />

        {/* Card Header */}
        <div className="relative px-3 sm:px-4 md:px-3 pt-2 sm:pt-2.5 md:pt-2 pb-2 sm:pb-2.5 md:pb-2 flex items-center justify-between z-10">
          <span className="text-xs sm:text-sm md:text-sm font-bold text-gray-800 group-hover:text-gray-900 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200 transition-colors duration-200 truncate max-w-[60%]">
            {id}
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-1 flex-shrink-0">
            <div
              className={`flex items-center gap-1 sm:gap-1.5 md:gap-1 px-2 sm:px-2.5 md:px-2 py-1 sm:py-1.5 md:py-1 rounded-full transition-all duration-300 ${
                status === "Active"
                  ? "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30"
                  : "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30"
              }`}
            >
              <span className={`relative flex h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-1.5 md:w-1.5`}>
                <span
                  className={`relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 md:h-1.5 md:w-1.5 ${status === "Active" ? "bg-green-500" : "bg-red-500"}`}
                ></span>
              </span>
              <span
                className={`text-[10px] sm:text-xs md:text-xs font-bold ${
                  status === "Active"
                    ? "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400"
                    : "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
                }`}
              >
                {status}
              </span>
            </div>
            <div className="relative z-50">
              <button
                onClick={() => {
                  setIsMenuOpen(!isMenuOpen);
                  onMenuClick?.();
                }}
                style={{ cursor: "pointer" }}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-md transition-all duration-200 group/menu"
              >
                <MoreVertical
                  style={{ cursor: "pointer" }}
                  className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover/menu:text-gray-600 dark:group-hover/menu:text-gray-300 midnight:group-hover/menu:text-cyan-400 purple:group-hover/menu:text-pink-400 transition-colors"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Profile Avatar and Info */}
        <div className="px-3 sm:px-4 md:px-3 py-1.5 sm:py-2 md:py-1.5 pb-2 sm:pb-3 md:pb-2 group-hover:pb-3 sm:group-hover:pb-4 md:group-hover:pb-2.5 flex items-center gap-2 sm:gap-2.5 md:gap-2 transition-all duration-300">
          {avatar ? (
            <div className="relative">
              <img
                src={avatar}
                alt={name}
                className="w-10 h-10 sm:w-11 sm:h-11 md:w-10 md:h-10 rounded-full object-cover shrink-0 ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-md transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-25 blur transition-opacity duration-300" />
            </div>
          ) : (
            <div className="relative">
              <div
                className={`w-10 h-10 sm:w-11 sm:h-11 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${getAvatarGradient(
                  colorIndex,
                )} flex items-center justify-center text-white text-xs sm:text-sm md:text-xs font-bold shrink-0 shadow-md ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
              >
                {getInitials(name)}
              </div>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm sm:text-base md:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-0.5 truncate transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 leading-tight">
              {name}
            </h3>
            <p className="text-xs sm:text-sm md:text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Profile Details */}
        <div className="px-3 sm:px-4 md:px-3 pb-1.5 sm:pb-2 md:pb-1.5 space-y-1 sm:space-y-1.5 md:space-y-0.5 relative z-10">
          {details.map((detail, index) => (
            <div
              key={index}
              className="group/detail flex items-center justify-between py-1.5 sm:py-2 md:py-1 px-2 sm:px-2.5 md:px-2 rounded-lg bg-white/70 backdrop-blur-sm dark:bg-gray-700/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 group-hover:bg-white/95 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/25 purple:group-hover:bg-pink-500/25 transition-all duration-200 border border-white/40 group-hover:border-white/60"
            >
              <span className="text-[10px] sm:text-xs md:text-[9px] font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors uppercase tracking-wider truncate">
                {detail.label}
              </span>
              <span className="text-xs sm:text-sm md:text-xs font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 group-hover:text-black ml-2 sm:ml-3 md:ml-2 flex-shrink-0">
                {detail.value}
              </span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="px-3 sm:px-4 md:px-3 pb-2 sm:pb-2.5 md:pb-2 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-1.5 sm:gap-2 md:gap-1.5 sm:justify-between border-t border-white/40 group-hover:border-white/60 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 mt-1.5 sm:mt-2 md:mt-1.5 pt-1.5 sm:pt-2 md:pt-1.5 relative z-10 transition-all duration-200">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 sm:gap-2 md:gap-1.5 order-2 sm:order-1">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                style={{ cursor: "pointer", zIndex: 11111 }}
                className="group/action flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-7 md:h-7 rounded-full border-2 border-white/60 group-hover:border-white/80 dark:border-gray-600/50 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white/70 backdrop-blur-sm group-hover:bg-white/95 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 group-hover:shadow-md dark:hover:bg-gray-700/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 shadow-sm"
                title={action.label}
              >
                <action.icon
                  style={{ cursor: "pointer" }}
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-3 md:h-3 text-gray-700 group-hover:text-gray-900 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 transition-colors"
                />
              </button>
            ))}
          </div>
          {primaryAction && (
            <button
              onClick={() => {
                if (primaryAction.label === "Add Fees") {
                  setIsFeesModalOpen(true);
                } else if (primaryAction.onClick) {
                  primaryAction.onClick();
                }
              }}
              style={{ cursor: "pointer", zIndex: 11111 }}
              className="w-auto px-3 sm:px-4 md:px-3 py-1.5 sm:py-2 md:py-1.5 rounded-md bg-gray-100 hover:bg-gray-200 group-hover:bg-white/90 dark:bg-gray-700/50 midnight:bg-cyan-500/10 purple:bg-pink-500/10 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 text-[10px] sm:text-[11px] md:text-xs font-semibold text-gray-700 hover:text-gray-900 group-hover:text-black dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 transition-all duration-200 border border-gray-200 hover:border-gray-300 group-hover:border-gray-300 shadow-sm hover:shadow-md group-hover:shadow-md order-1 sm:order-2 active:scale-95 whitespace-nowrap backdrop-blur-sm"
            >
              {primaryAction.label}
            </button>
          )}
        </div>
      </div>

      {/* Dropdown Menu - Outside card transform context */}
      {isMenuOpen && (
        <div
          ref={menuRef}
          className="absolute w-52 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 py-1"
          style={{
            position: "absolute",
            right: "1rem",
            top: "3.5rem",
            zIndex: 99999,
          }}
        >
          <button
            onClick={() => {
              setIsMenuOpen(false);
              // Handle view action
            }}
            className="w-full px-4 py-2 text-left text-sm font-normal text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 flex items-center gap-3 transition-all duration-200"
            style={{ cursor: "pointer" }}
          >
            <Eye className="w-4 h-4 text-gray-600" />
            <span>View Student</span>
          </button>

          <button
            onClick={() => {
              setIsMenuOpen(false);
              // Handle edit action
            }}
            className="w-full px-4 py-2 text-left text-sm font-normal text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 flex items-center gap-3 transition-all duration-200"
            style={{ cursor: "pointer" }}
          >
            <Edit className="w-4 h-4 text-gray-600" />
            <span>Edit</span>
          </button>

          <button
            onClick={() => {
              setIsMenuOpen(false);
              // Handle promote action
            }}
            className="w-full px-4 py-2 text-left text-sm font-normal text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 flex items-center gap-3 transition-all duration-200"
            style={{ cursor: "pointer" }}
          >
            <TrendingUp className="w-4 h-4 text-gray-600" />
            <span>Promote Student</span>
          </button>

          <button
            onClick={() => {
              setIsMenuOpen(false);
              // Handle delete action
            }}
            className="w-full px-4 py-2 text-left text-sm font-normal text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 midnight:hover:bg-red-900/20 purple:hover:bg-red-900/20 flex items-center gap-3 transition-all duration-200"
            style={{ cursor: "pointer" }}
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}

      {/* Collect Fees Modal */}
      <CollectFeesModal
        isOpen={isFeesModalOpen}
        onClose={() => setIsFeesModalOpen(false)}
        student={{
          id,
          name,
          class: subtitle,
          avatar,
          totalOutstanding: "2000",
          lastDate: "25 May 2024",
          status: status === "Active" ? "Unpaid" : "Paid",
        }}
      />
    </div>
  );
}
