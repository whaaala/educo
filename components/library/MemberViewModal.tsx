"use client";

import React from "react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import {
  User,
  Printer,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  BookOpen,
  Mail,
  Phone,
  Calendar,
  GraduationCap,
  Briefcase,
  School,
  CreditCard,
  Hash,
  AlertTriangle,
  DollarSign,
} from "lucide-react";
import type { LibraryMember, BorrowerType } from "@/types/library";

interface MemberViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: LibraryMember;
  formatCurrency: (amount: number) => string;
  onEdit?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
}

export default function MemberViewModal({
  isOpen,
  onClose,
  member,
  formatCurrency,
  onEdit,
  onPrint,
  onExport,
}: MemberViewModalProps) {
  const getMemberTypeConfig = (type: BorrowerType) => {
    const configs = {
      student: {
        icon: GraduationCap,
        label: "Student",
        bgClass: "bg-gradient-to-r from-purple-500 to-violet-500",
        textClass: "text-white",
        shadowClass: "shadow-purple-500/30",
      },
      staff: {
        icon: Briefcase,
        label: "Staff",
        bgClass: "bg-gradient-to-r from-orange-500 to-amber-500",
        textClass: "text-white",
        shadowClass: "shadow-orange-500/30",
      },
      teacher: {
        icon: School,
        label: "Teacher",
        bgClass: "bg-gradient-to-r from-cyan-500 to-teal-500",
        textClass: "text-white",
        shadowClass: "shadow-cyan-500/30",
      },
    };
    return configs[type] || configs.student;
  };

  const getStatusConfig = (isActive: boolean) => {
    if (isActive) {
      return {
        icon: CheckCircle2,
        label: "Active",
        bgClass: "bg-gradient-to-r from-emerald-500 to-green-500",
        textClass: "text-white",
        shadowClass: "shadow-emerald-500/30",
      };
    }
    return {
      icon: XCircle,
      label: "Inactive",
      bgClass: "bg-gradient-to-r from-gray-500 to-gray-600",
      textClass: "text-white",
      shadowClass: "shadow-gray-500/30",
    };
  };

  const memberTypeConfig = getMemberTypeConfig(member.type);
  const statusConfig = getStatusConfig(member.isActive);
  const TypeIcon = memberTypeConfig.icon;
  const StatusIcon = statusConfig.icon;

  // Calculate membership duration
  const memberSince = new Date(member.memberSince);
  const now = new Date();
  const years = now.getFullYear() - memberSince.getFullYear();
  const months = now.getMonth() - memberSince.getMonth();
  const totalMonths = years * 12 + months;
  const durationText = totalMonths < 12
    ? `${totalMonths} months`
    : `${Math.floor(totalMonths / 12)} years, ${totalMonths % 12} months`;

  // Check if membership is expiring soon (within 3 months)
  const expiryDate = member.expiryDate ? new Date(member.expiryDate) : null;
  const isExpiringSoon = expiryDate && expiryDate.getTime() - now.getTime() < 90 * 24 * 60 * 60 * 1000;
  const isExpired = expiryDate && now > expiryDate;

  // Generate avatar URL
  const getAvatarUrl = () => {
    if (member.avatarUrl) return member.avatarUrl;
    const gender = member.id.includes("002") || member.id.includes("004") || member.id.includes("006") || member.id.includes("007") || member.id.includes("009")
      ? "women"
      : "men";
    const index = parseInt(member.id.replace("mem-", "")) % 100;
    return `https://randomuser.me/api/portraits/${gender}/${index}.jpg`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member.name}
      subtitle={member.memberId}
      icon={<User className="w-5 h-5" />}
      maxWidth="2xl"
      footer={
        <div className="flex justify-between w-full">
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onPrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="secondary" onClick={onExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" onClick={onEdit}>
              Edit Member
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header with Avatar and Status */}
        <div className="flex gap-6">
          {/* Member Avatar */}
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex-shrink-0 shadow-2xl ring-4 ring-white dark:ring-gray-700">
            <Image
              src={getAvatarUrl()}
              alt={member.name}
              fill
              className="object-cover"
              unoptimized
            />
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </div>

          {/* Member Info & Status */}
          <div className="flex-1 min-w-0">
            {/* Status Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${memberTypeConfig.bgClass} ${memberTypeConfig.textClass} shadow-lg ${memberTypeConfig.shadowClass}`}>
                <TypeIcon className="w-3.5 h-3.5" />
                {memberTypeConfig.label}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bgClass} ${statusConfig.textClass} shadow-lg ${statusConfig.shadowClass}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </span>
              {member.finesDue > 0 && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/30">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  Has Fines
                </span>
              )}
              {isExpired && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-gray-600 to-gray-700 text-white shadow-lg shadow-gray-500/30">
                  Expired
                </span>
              )}
              {isExpiringSoon && !isExpired && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/30 animate-pulse">
                  Expiring Soon
                </span>
              )}
            </div>

            {/* Member Name */}
            <h3 className="text-lg font-bold text-ink mb-1">
              {member.name}
            </h3>

            {/* Class/Department */}
            <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              {member.class || member.department || "N/A"}
            </p>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/80 midnight:from-gray-800/80 midnight:via-gray-800/60 midnight:to-gray-900/80 purple:from-gray-800/80 purple:via-gray-800/60 purple:to-gray-900/80 p-5 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />

          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20">
              <Mail className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            </div>
            <h4 className="text-sm font-bold text-ink">
              Contact Information
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-2">
                <Mail className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Email</p>
                {member.email ? (
                  <a
                    href={`mailto:${member.email}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline transition-colors"
                  >
                    {member.email}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-ink">
                    N/A
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-surface-2">
                <Phone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Phone</p>
                {member.phone ? (
                  <a
                    href={`tel:${member.phone}`}
                    className="text-sm font-medium text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 hover:underline transition-colors"
                  >
                    {member.phone}
                  </a>
                ) : (
                  <p className="text-sm font-medium text-ink">
                    N/A
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Membership Timeline Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/80 midnight:from-gray-800/80 midnight:via-gray-800/60 midnight:to-gray-900/80 purple:from-gray-800/80 purple:via-gray-800/60 purple:to-gray-900/80 p-5 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-full blur-2xl" />

          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20">
              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="text-sm font-bold text-ink">
              Membership Timeline
            </h4>
          </div>

          {/* Timeline Visual */}
          <div className="relative">
            <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-gradient-to-b from-green-500 via-blue-500 to-amber-500 dark:from-green-400 dark:via-blue-400 dark:to-amber-400" />

            <div className="space-y-4">
              {/* Member Since */}
              <div className="flex items-start gap-4 relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30 flex-shrink-0 z-10">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Member Since</p>
                  <p className="text-sm font-semibold text-ink">
                    {memberSince.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {durationText}
                  </p>
                </div>
              </div>

              {/* Expiry Date */}
              {expiryDate && (
                <div className="flex items-start gap-4 relative">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg flex-shrink-0 z-10 ${
                    isExpired
                      ? "bg-gradient-to-br from-gray-500 to-gray-600 shadow-gray-500/30"
                      : isExpiringSoon
                        ? "bg-gradient-to-br from-amber-500 to-orange-500 shadow-amber-500/30"
                        : "bg-gradient-to-br from-blue-500 to-indigo-500 shadow-blue-500/30"
                  }`}>
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 pt-1">
                    <p className={`text-[0.625rem] font-bold uppercase tracking-widest ${
                      isExpired
                        ? "text-gray-600 dark:text-gray-400"
                        : isExpiringSoon
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-gray-400 dark:text-gray-500"
                    }`}>
                      {isExpired ? "Expired On" : "Expiry Date"}
                    </p>
                    <p className={`text-sm font-semibold ${
                      isExpired
                        ? "text-gray-600 dark:text-gray-400 line-through"
                        : isExpiringSoon
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-ink"
                    }`}>
                      {expiryDate.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {/* Member ID */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <div className="flex items-center gap-2 mb-1.5">
              <CreditCard className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Member ID</p>
            </div>
            <p className="text-sm font-bold text-ink font-mono relative z-10">{member.memberId}</p>
          </div>

          {/* Books Borrowed */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Current Books</p>
            </div>
            <p className="text-sm font-bold relative z-10">
              <span className={member.currentBooksCount >= member.maxBooksAllowed ? "text-red-600 dark:text-red-400" : "text-ink"}>
                {member.currentBooksCount}
              </span>
              <span className="text-gray-400 dark:text-gray-500"> / {member.maxBooksAllowed}</span>
            </p>
          </div>

          {/* Total Borrowed */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <div className="flex items-center gap-2 mb-1.5">
              <Hash className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Total Borrowed</p>
            </div>
            <p className="text-sm font-bold text-ink relative z-10">{member.totalBorrowedCount}</p>
          </div>

          {/* Fines Due */}
          <div className={`group relative overflow-hidden rounded-xl p-4 border shadow-sm hover:shadow-md transition-all duration-300 ${
            member.finesDue > 0
              ? "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/30 dark:to-rose-900/30 midnight:from-red-900/30 midnight:to-rose-900/30 purple:from-red-900/30 purple:to-rose-900/30 border-red-200/60 dark:border-red-700/60 midnight:border-red-500/20 purple:border-red-500/20"
              : "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20"
          }`}>
            <div className="flex items-center gap-2 mb-1.5">
              <DollarSign className={`w-3.5 h-3.5 ${member.finesDue > 0 ? "text-red-500" : "text-gray-400 dark:text-gray-500"}`} />
              <p className={`text-[0.625rem] font-bold uppercase tracking-widest ${member.finesDue > 0 ? "text-red-600 dark:text-red-400" : "text-gray-400 dark:text-gray-500"}`}>Fines Due</p>
            </div>
            <p className="text-sm font-bold relative z-10">
              {member.finesDue > 0 ? (
                <span className="text-red-600 dark:text-red-400">{formatCurrency(member.finesDue)}</span>
              ) : (
                <span className="text-ink">No Fines</span>
              )}
            </p>
          </div>

          {/* Max Books Allowed */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <div className="flex items-center gap-2 mb-1.5">
              <BookOpen className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Max Books</p>
            </div>
            <p className="text-sm font-bold text-ink relative z-10">{member.maxBooksAllowed}</p>
          </div>

          {/* Person ID */}
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 midnight:from-gray-800 midnight:to-gray-850 purple:from-gray-800 purple:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <div className="flex items-center gap-2 mb-1.5">
              <User className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <p className="text-[0.625rem] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">Person ID</p>
            </div>
            <p className="text-sm font-bold text-ink font-mono relative z-10">{member.personId}</p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 border-t border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20 pt-4">
          <p className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Created:</span>
            {new Date(member.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
          <p className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold text-gray-600 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">Updated:</span>
            {new Date(member.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>
    </Modal>
  );
}
