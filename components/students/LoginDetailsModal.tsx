"use client";

import { KeyRound, Eye, EyeOff, Mail, Chrome } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import ModalHeader from "@/components/shared/ModalHeader";

interface SocialLogin {
  provider: "google" | "facebook" | "microsoft" | "apple";
  email: string;
}

interface LoginDetail {
  userType: string;
  username: string;
  password: string;
  socialLogins?: SocialLogin[];
}

interface LoginDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentPhoto?: string | null;
  loginDetails: LoginDetail[];
  canViewPasswords?: boolean; // Permission to view passwords
}

export default function LoginDetailsModal({
  isOpen,
  onClose,
  studentName,
  studentPhoto,
  loginDetails,
  canViewPasswords = true, // Default to true, can be set based on user permissions
}: LoginDetailsModalProps) {
  // Track which passwords are visible
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());

  // Toggle password visibility for a specific row
  const togglePasswordVisibility = (index: number) => {
    setVisiblePasswords(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // Get social login icon and color
  const getSocialLoginIcon = (provider: string) => {
    switch (provider) {
      case "google":
        return { icon: Chrome, color: "text-red-500", label: "Google" };
      case "facebook":
        return { icon: Mail, color: "text-blue-600", label: "Facebook" };
      case "microsoft":
        return { icon: Mail, color: "text-blue-500", label: "Microsoft" };
      case "apple":
        return { icon: Mail, color: "text-gray-900 dark:text-white", label: "Apple" };
      default:
        return { icon: Mail, color: "text-gray-500", label: provider };
    }
  };

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

  // Reset visible passwords when modal closes
  useEffect(() => {
    if (!isOpen) {
      setVisiblePasswords(new Set());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <ModalHeader
          title="Login Details"
          icon={KeyRound}
          onClose={onClose}
          variant="blue"
        />

        {/* Student Info Section */}
        <div className="flex items-center gap-4 px-6 py-5 bg-gradient-to-br from-gray-50/50 to-gray-100/30 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-800/40 midnight:to-gray-900/30 purple:from-gray-800/40 purple:to-gray-900/30 border-b border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20">
          {studentPhoto ? (
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-white dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 shadow-md flex-shrink-0">
              <Image
                src={studentPhoto}
                alt={studentName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-700 midnight:from-cyan-500 midnight:via-blue-500 midnight:to-purple-600 purple:from-pink-500 purple:via-purple-500 purple:to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
              {studentName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
              {studentName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Student Account Information
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-6 py-5 overflow-x-auto">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden shadow-sm">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 uppercase tracking-wide">
                    User Type
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 uppercase tracking-wide">
                    User Name
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 uppercase tracking-wide">
                    Password
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 uppercase tracking-wide">
                    Login Methods
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]">
                {loginDetails.map((detail, index) => {
                  const isPasswordVisible = visiblePasswords.has(index);

                  return (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-[#22262e]/30 midnight:hover:bg-cyan-500/5 purple:hover:bg-pink-500/5 transition-colors duration-150"
                    >
                      <td className="py-3.5 px-4 text-sm font-medium text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200">
                        {detail.userType}
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 font-mono">
                        {detail.username}
                      </td>
                      <td className="py-3.5 px-4">
                        {canViewPasswords ? (
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 font-mono">
                              {isPasswordVisible ? detail.password : "••••••••"}
                            </span>
                            <button
                              onClick={() => togglePasswordVisibility(index)}
                              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all duration-200 cursor-pointer active:scale-95"
                              title={isPasswordVisible ? "Hide password" : "Show password"}
                            >
                              {isPasswordVisible ? (
                                <EyeOff className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500 italic">
                            No permission
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        {detail.socialLogins && detail.socialLogins.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {detail.socialLogins.map((social, socialIndex) => {
                              const { icon: SocialIcon, color, label } = getSocialLoginIcon(social.provider);
                              return (
                                <div
                                  key={socialIndex}
                                  className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                                  title={`${label}: ${social.email}`}
                                >
                                  <SocialIcon className={`w-3.5 h-3.5 ${color}`} />
                                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                                    {label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50">
                            None
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 bg-gray-50/30 dark:bg-[#1a1d24]/20 midnight:bg-[#0f1330]/20 purple:bg-[#251340]/20">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-200 dark:bg-[#22262e] midnight:bg-gray-700 purple:bg-gray-700 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-300 dark:hover:bg-[#2a2d35] midnight:hover:bg-gray-600 purple:hover:bg-gray-600 transition-all duration-200 font-medium text-sm shadow-sm hover:shadow active:scale-95 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
