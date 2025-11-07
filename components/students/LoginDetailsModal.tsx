"use client";

import { X } from "lucide-react";
import Image from "next/image";

interface LoginDetail {
  userType: string;
  username: string;
  password: string;
}

interface LoginDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  studentPhoto?: string | null;
  loginDetails: LoginDetail[];
}

export default function LoginDetailsModal({
  isOpen,
  onClose,
  studentName,
  studentPhoto,
  loginDetails,
}: LoginDetailsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div
        className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative px-8 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Login Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-all duration-200 hover:rotate-90"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Student Info Section */}
        <div className="flex items-center justify-center gap-4 px-8 py-6 bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 midnight:from-gray-800/50 midnight:to-gray-800/30 purple:from-gray-800/50 purple:to-gray-800/30 border-y border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/10 purple:border-pink-500/10">
          {studentPhoto ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-4 border-white dark:border-gray-700 shadow-lg ring-2 ring-gray-200 dark:ring-gray-600">
              <Image
                src={studentPhoto}
                alt={studentName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-700 flex items-center justify-center text-white font-bold text-2xl shadow-lg ring-4 ring-blue-500/20">
              {studentName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {studentName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
              Student Account Information
            </p>
          </div>
        </div>

        {/* Table Section */}
        <div className="px-8 py-6 overflow-x-auto">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-gray-100/80 dark:from-gray-800 dark:to-gray-800/80 midnight:from-gray-800 midnight:to-gray-800/80 purple:from-gray-800 purple:to-gray-800/80">
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    User Type
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    User Name
                  </th>
                  <th className="text-left py-4 px-6 text-sm font-bold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 uppercase tracking-wider">
                    Password
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 midnight:divide-cyan-500/10 purple:divide-pink-500/10">
                {loginDetails.map((detail, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 dark:hover:bg-gray-700/20 midnight:hover:bg-gray-800/20 purple:hover:bg-gray-800/20 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300/90 purple:text-pink-300/90">
                      {detail.userType}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 font-mono">
                      {detail.username}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 font-mono">
                      {detail.password}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-8 py-6 bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-800/30 purple:bg-gray-800/30">
          <button
            onClick={onClose}
            className="px-8 py-2.5 rounded-xl bg-gray-200 dark:bg-gray-700 midnight:bg-gray-800 purple:bg-gray-800 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-300 dark:hover:bg-gray-600 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-all duration-200 font-semibold shadow-sm hover:shadow-md active:scale-95"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
