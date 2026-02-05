"use client";

import React from "react";
import Image from "next/image";
import Modal from "@/components/shared/Modal";
import Button from "@/components/shared/Button";
import {
  BookOpen,
  BookMarked,
  Printer,
  Download,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import type { Book, BookStatus, BookCondition } from "@/types/library";

interface BookViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book;
  formatCurrency: (price: number) => string;
  onIssueBook?: () => void;
  onPrint?: () => void;
  onExport?: () => void;
}

export default function BookViewModal({
  isOpen,
  onClose,
  book,
  formatCurrency,
  onIssueBook,
  onPrint,
  onExport,
}: BookViewModalProps) {
  const getStatusConfig = (status: BookStatus) => {
    const configs = {
      available: {
        icon: CheckCircle2,
        label: "Available",
        bgClass: "bg-gradient-to-r from-emerald-500 to-green-500",
        textClass: "text-white",
        shadowClass: "shadow-emerald-500/30",
      },
      borrowed: {
        icon: BookMarked,
        label: "Borrowed",
        bgClass: "bg-gradient-to-r from-blue-500 to-indigo-500",
        textClass: "text-white",
        shadowClass: "shadow-blue-500/30",
      },
      reserved: {
        icon: Clock,
        label: "Reserved",
        bgClass: "bg-gradient-to-r from-amber-500 to-orange-500",
        textClass: "text-white",
        shadowClass: "shadow-amber-500/30",
      },
      maintenance: {
        icon: AlertTriangle,
        label: "Maintenance",
        bgClass: "bg-gradient-to-r from-orange-500 to-red-500",
        textClass: "text-white",
        shadowClass: "shadow-orange-500/30",
      },
      lost: {
        icon: XCircle,
        label: "Lost",
        bgClass: "bg-gradient-to-r from-red-500 to-rose-500",
        textClass: "text-white",
        shadowClass: "shadow-red-500/30",
      },
      damaged: {
        icon: AlertTriangle,
        label: "Damaged",
        bgClass: "bg-gradient-to-r from-rose-500 to-pink-500",
        textClass: "text-white",
        shadowClass: "shadow-rose-500/30",
      },
    };
    return configs[status] || configs.available;
  };

  const getConditionConfig = (condition: BookCondition) => {
    const configs = {
      new: {
        label: "New",
        bgClass: "bg-gradient-to-r from-emerald-500 to-teal-500",
        textClass: "text-white",
        shadowClass: "shadow-emerald-500/30",
      },
      excellent: {
        label: "Excellent",
        bgClass: "bg-gradient-to-r from-blue-500 to-cyan-500",
        textClass: "text-white",
        shadowClass: "shadow-blue-500/30",
      },
      good: {
        label: "Good",
        bgClass: "bg-gradient-to-r from-green-500 to-emerald-500",
        textClass: "text-white",
        shadowClass: "shadow-green-500/30",
      },
      fair: {
        label: "Fair",
        bgClass: "bg-gradient-to-r from-amber-500 to-yellow-500",
        textClass: "text-white",
        shadowClass: "shadow-amber-500/30",
      },
      poor: {
        label: "Poor",
        bgClass: "bg-gradient-to-r from-red-500 to-orange-500",
        textClass: "text-white",
        shadowClass: "shadow-red-500/30",
      },
      damaged: {
        label: "Damaged",
        bgClass: "bg-gradient-to-r from-red-700 to-rose-600",
        textClass: "text-white",
        shadowClass: "shadow-red-700/30",
      },
    };
    return configs[condition] || configs.good;
  };

  const statusConfig = getStatusConfig(book.status);
  const conditionConfig = getConditionConfig(book.condition);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book.title}
      subtitle={`by ${book.author}`}
      icon={<BookOpen className="w-5 h-5" />}
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
            {book.status === "available" && book.availableCopies > 0 && (
              <Button variant="primary" onClick={onIssueBook}>
                <BookMarked className="w-4 h-4 mr-2" />
                Issue Book
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Header with Cover and Status */}
        <div className="flex gap-6">
          {/* Book Cover */}
          <div className="relative w-28 h-40 sm:w-32 sm:h-44 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex-shrink-0 shadow-2xl ring-4 ring-white dark:ring-gray-700">
            {book.coverImage ? (
              <Image
                src={book.coverImage}
                alt={book.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-700 dark:to-gray-800">
                <BookOpen className="w-12 h-12 text-blue-300 dark:text-gray-500" />
              </div>
            )}
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none" />
          </div>

          {/* Info Section */}
          <div className="flex-1 min-w-0">
            {/* Status and Condition Badges */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${statusConfig.bgClass} ${statusConfig.textClass} shadow-lg ${statusConfig.shadowClass}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse" />
                {statusConfig.label}
              </span>
              <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold ${conditionConfig.bgClass} ${conditionConfig.textClass} shadow-lg ${conditionConfig.shadowClass}`}>
                {conditionConfig.label}
              </span>
            </div>

            {/* Publisher Info */}
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-medium">
              {book.publisher} {book.edition && `- ${book.edition}`} ({book.publishYear})
            </p>

            {/* Category Tags */}
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/40 dark:to-pink-900/40 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-700/50 capitalize shadow-sm">
                {book.category.replace("-", " ")}
              </span>
              <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/40 dark:to-cyan-900/40 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50 shadow-sm">
                {book.educationLevel}
              </span>
              {book.subject && (
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800 text-gray-700 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50 shadow-sm">
                  {book.subject}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {book.description && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 dark:from-gray-800/80 dark:via-gray-800/60 dark:to-gray-900/80 p-5 border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-2xl" />
            <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">Description</h4>
            <p className="text-sm text-gray-700 dark:text-gray-200 leading-relaxed relative z-10">{book.description}</p>
          </div>
        )}

        {/* Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">ISBN</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white font-mono relative z-10">{book.isbn}</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Language</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white relative z-10">{book.language}</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Pages</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white relative z-10">{book.pages || "N/A"}</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Location</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white relative z-10">{book.location}</p>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-850 p-4 border border-gray-200/60 dark:border-gray-700/60 shadow-sm hover:shadow-md hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-300" />
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1.5">Price</p>
            <p className="text-sm font-bold text-gray-900 dark:text-white relative z-10">
              {book.price ? formatCurrency(book.price) : "N/A"}
            </p>
          </div>
          <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 p-4 border border-emerald-200/60 dark:border-emerald-700/60 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-green-500/0 group-hover:from-emerald-500/10 group-hover:to-green-500/10 transition-all duration-300" />
            <p className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1.5">Copies</p>
            <p className="text-sm font-bold relative z-10">
              <span className={book.availableCopies > 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
                {book.availableCopies} available
              </span>
              <span className="text-gray-400 dark:text-gray-500"> / {book.totalCopies} total</span>
            </p>
          </div>
        </div>

        {/* Tags */}
        {book.tags && book.tags.length > 0 && (
          <div>
            <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">Tags</h4>
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-700 dark:to-slate-700 text-gray-600 dark:text-gray-300 border border-gray-200/50 dark:border-gray-600/50 shadow-sm hover:shadow hover:from-gray-200 hover:to-slate-200 dark:hover:from-gray-600 dark:hover:to-slate-600 transition-all duration-200 cursor-default"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/60 dark:border-gray-700/60 pt-4">
          <p className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Acquired:</span>
            {new Date(book.acquisitionDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          <p className="flex items-center gap-1.5">
            <span className="font-semibold text-gray-600 dark:text-gray-300">Updated:</span>
            {new Date(book.updatedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>
    </Modal>
  );
}
