"use client";

import { CalendarPlus, Send, Stethoscope, Coffee } from "lucide-react";
import Button from "@/components/shared/Button";

interface LeaveBalance {
  type: string;
  total: number;
  used: number;
  available: number;
  icon: "medical" | "casual";
}

interface QuickActionsCardProps {
  leaveBalances: LeaveBalance[];
  onApplyLeave?: () => void;
  onRaiseRequest?: () => void;
}

export default function QuickActionsCard({
  leaveBalances,
  onApplyLeave,
  onRaiseRequest,
}: QuickActionsCardProps) {
  const getIcon = (iconType: "medical" | "casual") => {
    switch (iconType) {
      case "medical":
        return <Stethoscope className="w-5 h-5" />;
      case "casual":
        return <Coffee className="w-5 h-5" />;
      default:
        return <CalendarPlus className="w-5 h-5" />;
    }
  };

  const getIconColors = (iconType: "medical" | "casual") => {
    switch (iconType) {
      case "medical":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400";
      case "casual":
        return "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-700/50">
        <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
          Quick Actions
        </h3>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={onApplyLeave}
            className="flex items-center justify-center gap-2 py-3 border-dashed border-2 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
          >
            <CalendarPlus className="w-4 h-4" />
            <span className="text-sm font-medium">Apply Leave</span>
          </Button>
          <Button
            variant="outline"
            onClick={onRaiseRequest}
            className="flex items-center justify-center gap-2 py-3 border-dashed border-2 hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
          >
            <Send className="w-4 h-4" />
            <span className="text-sm font-medium">Raise Request</span>
          </Button>
        </div>

        {/* Leave Balance Cards */}
        <div className="grid grid-cols-2 gap-3">
          {leaveBalances.map((leave, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 midnight:from-gray-800/50 midnight:to-gray-900/30 purple:from-gray-800/50 purple:to-gray-900/30 border border-gray-200/60 dark:border-gray-700/40"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`p-2 rounded-lg ${getIconColors(leave.icon)}`}>
                  {getIcon(leave.icon)}
                </div>
              </div>
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                {leave.type}
              </p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  {leave.available}
                </span>
                <span className="text-sm text-gray-400 dark:text-gray-500">
                  / {leave.total}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {leave.used} Used
              </p>
              {/* Progress Bar */}
              <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    leave.icon === "medical"
                      ? "bg-blue-500 dark:bg-blue-400"
                      : "bg-orange-500 dark:bg-orange-400"
                  }`}
                  style={{ width: `${(leave.used / leave.total) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
