"use client";

import { Mail, Phone, MessageCircle, MoreVertical, LucideIcon } from "lucide-react";

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
    <div
      className="group relative bg-white dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 hover:bg-gradient-to-br hover:from-blue-100 hover:via-purple-100 hover:to-pink-100 dark:hover:bg-gray-800/90 midnight:hover:bg-cyan-900/20 purple:hover:bg-pink-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden backdrop-blur-sm transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20 dark:hover:shadow-blue-400/30 midnight:hover:shadow-cyan-400/30 purple:hover:shadow-pink-400/30 hover:border-purple-300/60 dark:hover:border-blue-400/50 midnight:hover:border-cyan-400/50 purple:hover:border-pink-400/50 hover:-translate-y-2 hover:scale-[1.02]"
    >
      {/* Gradient Overlay Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/3 to-pink-500/5 dark:from-blue-400/15 dark:via-purple-400/8 dark:to-pink-400/15 midnight:from-cyan-400/15 midnight:via-purple-400/8 midnight:to-cyan-400/15 purple:from-pink-400/15 purple:via-purple-400/8 purple:to-pink-400/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Animated Border Glow */}
      <div className="absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30 dark:from-blue-400/40 dark:via-purple-400/40 dark:to-pink-400/40 midnight:from-cyan-400/40 midnight:via-purple-400/40 midnight:to-cyan-400/40 purple:from-pink-400/40 purple:via-purple-400/40 purple:to-pink-400/40 blur-md -z-10" />
      {/* Card Header */}
      <div className="relative px-4 sm:px-5 pt-2.5 pb-2.5 flex items-center justify-between z-10">
        <span className="text-xs sm:text-sm font-semibold text-gray-700 group-hover:text-black dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 transition-colors duration-200 truncate">
          {id}
        </span>
        <div className="flex items-center gap-1 flex-shrink-0">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full transition-all duration-300 ${
              status === "Active"
                ? "bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30"
                : "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30"
            }`}
          >
            <span className={`relative flex h-1.5 w-1.5`}>
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${status === "Active" ? "bg-green-500" : "bg-red-500"}`}></span>
            </span>
            <span className={`text-[11px] font-semibold ${
              status === "Active"
                ? "text-green-700 dark:text-green-400 midnight:text-green-400 purple:text-green-400"
                : "text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400"
            }`}>
              {status}
            </span>
          </div>
          <button
            onClick={onMenuClick}
            style={{ cursor: 'pointer' }}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700/50 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 rounded-md transition-all duration-200 group/menu"
          >
            <MoreVertical style={{ cursor: 'pointer' }} className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover/menu:text-gray-600 dark:group-hover/menu:text-gray-300 midnight:group-hover/menu:text-cyan-400 purple:group-hover/menu:text-pink-400 transition-colors" />
          </button>
        </div>
      </div>

      {/* Profile Avatar and Info */}
      <div className="px-4 sm:px-5 py-2 flex items-center gap-2 sm:gap-3">
        {avatar ? (
          <div className="relative">
            <img
              src={avatar}
              alt={name}
              className="w-12 h-12 rounded-full object-cover shrink-0 ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 shadow-md transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-25 blur transition-opacity duration-300" />
          </div>
        ) : (
          <div className="relative">
            <div
              className={`w-12 h-12 rounded-full bg-gradient-to-br ${getAvatarGradient(
                colorIndex
              )} flex items-center justify-center text-white text-sm font-bold shrink-0 shadow-md ring-2 ring-white/80 dark:ring-gray-700/50 midnight:ring-cyan-500/30 purple:ring-pink-500/30 transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
            >
              {getInitials(name)}
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-0 group-hover:opacity-30 blur transition-opacity duration-300" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-0 truncate transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 midnight:group-hover:text-cyan-400 purple:group-hover:text-pink-400 leading-tight">
            {name}
          </h3>
          <p className="text-[10px] sm:text-[11px] font-medium text-gray-500 dark:text-gray-500 midnight:text-cyan-400/70 purple:text-pink-400/70 truncate mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Profile Details */}
      <div className="px-4 sm:px-5 pb-2 space-y-1 relative z-10">
        {details.map((detail, index) => (
          <div
            key={index}
            className="group/detail flex items-center justify-between py-1 px-2 sm:px-2.5 rounded-md bg-white/70 backdrop-blur-sm dark:bg-gray-700/40 midnight:bg-cyan-500/10 purple:bg-pink-500/10 group-hover:bg-white/95 dark:group-hover:bg-gray-700/60 midnight:group-hover:bg-cyan-500/25 purple:group-hover:bg-pink-500/25 transition-all duration-200 border border-white/40 group-hover:border-white/60"
          >
            <span className="text-[10px] sm:text-[11px] font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400/90 purple:text-pink-400/90 group-hover:text-gray-800 dark:group-hover:text-gray-200 transition-colors uppercase tracking-wide truncate">
              {detail.label}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 group-hover:text-black ml-2 flex-shrink-0">
              {detail.value}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="px-4 sm:px-5 pb-3 pt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:justify-between border-t border-white/40 group-hover:border-white/60 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10 mt-2 pt-2 relative z-10 transition-all duration-200">
        <div className="flex items-center justify-center sm:justify-start gap-2 order-2 sm:order-1">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              style={{ cursor: 'pointer', zIndex: 11111 }}
              className="group/action flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/60 group-hover:border-white/80 dark:border-gray-600/50 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white/70 backdrop-blur-sm group-hover:bg-white/95 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 group-hover:shadow-md dark:hover:bg-gray-700/30 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 shadow-sm"
              title={action.label}
            >
              <action.icon style={{ cursor: 'pointer' }} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700 group-hover:text-gray-900 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 transition-colors" />
            </button>
          ))}
        </div>
        {primaryAction && (
          <button
            onClick={primaryAction.onClick}
            style={{ cursor: 'pointer', zIndex: 11111 }}
            className="w-auto px-4 py-2 rounded-lg sm:rounded-md bg-gradient-to-r from-blue-500 to-purple-500 sm:bg-white/80 sm:backdrop-blur-sm hover:from-blue-600 hover:to-purple-600 sm:hover:bg-white group-hover:from-blue-600 group-hover:to-purple-600 sm:group-hover:bg-white dark:bg-gray-700/50 midnight:bg-cyan-500/10 purple:bg-pink-500/10 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/20 purple:hover:bg-pink-500/20 text-[11px] sm:text-xs font-bold text-white sm:text-gray-800 sm:group-hover:text-black dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 transition-all duration-200 border-0 sm:border sm:border-white/50 sm:group-hover:border-white/70 shadow-lg sm:shadow-sm hover:shadow-xl sm:hover:shadow-md group-hover:shadow-xl sm:group-hover:shadow-md order-1 sm:order-2 active:scale-95 whitespace-nowrap"
          >
            {primaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
}
