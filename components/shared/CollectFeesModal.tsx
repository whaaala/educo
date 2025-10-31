"use client";

import { useState, useRef, useEffect } from "react";
import {
  X,
  Calendar,
  DollarSign,
  Layers,
  Clock,
  CreditCard,
  FileText,
  Hash,
  ChevronDown
} from "lucide-react";
import ModernCalendar from "./ModernCalendar";

interface Student {
  id: string;
  name: string;
  class: string;
  avatar?: string;
  totalOutstanding: string;
  lastDate: string;
  status: "Paid" | "Unpaid";
}

interface CollectFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student;
}

export default function CollectFeesModal({
  isOpen,
  onClose,
  student,
}: CollectFeesModalProps) {
  const [feesGroup, setFeesGroup] = useState("");
  const [feesType, setFeesType] = useState("");
  const [amount, setAmount] = useState("");
  const [collectionDate, setCollectionDate] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentReference, setPaymentReference] = useState("");
  const [status, setStatus] = useState(false);
  const [notes, setNotes] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      feesGroup,
      feesType,
      amount,
      collectionDate,
      paymentType,
      paymentReference,
      status,
      notes,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-md pt-4 pb-4 px-4 sm:px-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-32px)] flex flex-col animate-in fade-in zoom-in duration-200">
        {/* Header with Gradient */}
        <div className="flex-shrink-0 relative bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 midnight:from-cyan-600 midnight:to-purple-600 purple:from-pink-600 purple:to-purple-600 px-4 sm:px-5 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  Collect Fees
                </h2>
                <p className="text-xs text-white/80 mt-0.5">Process fee payment for student</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors group"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Student Info Card */}
        <div className="px-6 py-5 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 midnight:from-cyan-900/10 midnight:to-cyan-800/5 purple:from-pink-900/10 purple:to-pink-800/5">
          <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <div className="flex items-center gap-4">
              {student.avatar ? (
                <div className="relative">
                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-blue-500/20 dark:ring-blue-400/20"
                  />
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 rounded-full flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                    ✓
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 midnight:from-cyan-600 midnight:to-purple-600 purple:from-pink-600 purple:to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-blue-500/20">
                    {student.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                    {student.name}
                  </h3>
                  <span className="px-2 py-0.5 text-xs font-semibold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 rounded">
                    {student.id}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mb-3">
                  Class: {student.class}
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 dark:bg-gray-700/30 midnight:bg-cyan-900/10 purple:bg-pink-900/10 rounded-lg p-2">
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 uppercase tracking-wide">
                      Outstanding
                    </span>
                    <p className="text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-0.5">
                      ${student.totalOutstanding}
                    </p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-700/30 midnight:bg-cyan-900/10 purple:bg-pink-900/10 rounded-lg p-2">
                    <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 uppercase tracking-wide">
                      Last Date
                    </span>
                    <p className="text-xs font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-0.5">
                      {student.lastDate}
                    </p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${
                        student.status === "Paid"
                          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ring-1 ring-green-500/20"
                          : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 ring-1 ring-red-500/20"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          student.status === "Paid" ? "bg-green-500 animate-pulse" : "bg-red-500 animate-pulse"
                        }`}
                      ></span>
                      {student.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form - Scrollable Content */}
        <div className="flex-1 overflow-y-auto overflow-x-visible">
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {/* Fees Group */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Layers className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
                </div>
                <span>Fees Group</span>
              </label>
              <div className="relative">
                <select
                  value={feesGroup}
                  onChange={(e) => setFeesGroup(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all hover:border-blue-300 dark:hover:border-gray-600 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="">Select fees group</option>
                  <option value="tuition">💼 Tuition Fees</option>
                  <option value="transport">🚌 Transport Fees</option>
                  <option value="library">📚 Library Fees</option>
                  <option value="sports">⚽ Sports Fees</option>
                  <option value="exam">📝 Examination Fees</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Fees Type */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/30 midnight:bg-purple-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                  <Clock className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-pink-400" />
                </div>
                <span>Fees Type</span>
              </label>
              <div className="relative">
                <select
                  value={feesType}
                  onChange={(e) => setFeesType(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all hover:border-blue-300 dark:hover:border-gray-600 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="">Select payment frequency</option>
                  <option value="monthly">📅 Monthly</option>
                  <option value="quarterly">📆 Quarterly</option>
                  <option value="semester">🗓️ Semester</option>
                  <option value="annual">📋 Annual</option>
                  <option value="onetime">⚡ One-time</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Amount */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-green-100 dark:bg-green-900/30 midnight:bg-green-900/30 purple:bg-green-900/30 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400" />
                </div>
                <span>Amount</span>
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 dark:bg-gray-700 midnight:bg-cyan-900/30 purple:bg-pink-900/30">
                  <span className="text-gray-600 dark:text-gray-400 font-bold text-sm">$</span>
                </div>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-14 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-semibold placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all hover:border-blue-300 dark:hover:border-gray-600 shadow-sm"
                />
              </div>
            </div>

            {/* Collection Date */}
            <div className="group" ref={calendarRef}>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-900/30 midnight:bg-orange-900/30 purple:bg-orange-900/30 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400 midnight:text-orange-400 purple:text-orange-400" />
                </div>
                <span>Collection Date</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none z-10" />
                <input
                  type="text"
                  value={collectionDate ? new Date(collectionDate).toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : ''}
                  onClick={() => setShowCalendar(!showCalendar)}
                  onFocus={() => setShowCalendar(true)}
                  readOnly
                  placeholder="Select collection date"
                  className="w-full pl-12 pr-12 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all hover:border-blue-300 dark:hover:border-gray-600 shadow-sm cursor-pointer placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <ChevronDown
                  className={`absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none transition-transform duration-200 ${showCalendar ? 'rotate-180' : ''}`}
                />
                {showCalendar && (
                  <ModernCalendar
                    value={collectionDate}
                    onChange={(date) => {
                      setCollectionDate(date);
                    }}
                    onClose={() => setShowCalendar(false)}
                  />
                )}
              </div>
            </div>

            {/* Payment Type */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 flex items-center justify-center">
                  <CreditCard className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
                </div>
                <span>Payment Type</span>
              </label>
              <div className="relative">
                <select
                  value={paymentType}
                  onChange={(e) => setPaymentType(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-medium focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all hover:border-blue-300 dark:hover:border-gray-600 shadow-sm appearance-none cursor-pointer"
                >
                  <option value="">Select payment method</option>
                  <option value="cash">💵 Cash</option>
                  <option value="card">💳 Debit/Credit Card</option>
                  <option value="bank">🏦 Bank Transfer</option>
                  <option value="cheque">📝 Cheque</option>
                  <option value="wallet">📱 Digital Wallet</option>
                  <option value="upi">🔗 UPI</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Payment Reference No */}
            <div className="group">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-100 dark:bg-cyan-900/30 midnight:bg-cyan-900/30 purple:bg-cyan-900/30 flex items-center justify-center">
                  <Hash className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 midnight:text-cyan-400 purple:text-cyan-400" />
                </div>
                <span>Payment Reference No</span>
              </label>
              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                <input
                  type="text"
                  value={paymentReference}
                  onChange={(e) => setPaymentReference(e.target.value)}
                  placeholder="REF-XXXXXX"
                  className="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-medium placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all hover:border-blue-300 dark:hover:border-gray-600 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Status Toggle */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10 midnight:from-cyan-900/10 midnight:to-purple-900/10 purple:from-pink-900/10 purple:to-purple-900/10 rounded-xl p-4 border border-blue-200/50 dark:border-blue-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 animate-pulse"></span>
                  Payment Status
                </span>
                <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mt-1">
                  Toggle to mark as {status ? "pending" : "completed"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setStatus(!status)}
                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all shadow-inner ${
                  status
                    ? "bg-gradient-to-r from-green-500 to-green-600 shadow-green-500/50"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform ${
                    status ? "translate-x-8" : "translate-x-1"
                  }`}
                >
                  {status && <span className="flex items-center justify-center text-green-600 text-xs">✓</span>}
                </span>
              </button>
            </label>
          </div>

          {/* Notes */}
          <div className="group">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-700/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 flex items-center justify-center">
                <FileText className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <span>Notes</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">(Optional)</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-4 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes or comments..."
                rows={4}
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-500/20 purple:focus:ring-pink-500/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all hover:border-blue-300 dark:hover:border-gray-600 shadow-sm resize-none"
              ></textarea>
            </div>
          </div>
        </form>
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 px-4 sm:px-5 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 shadow-lg">
          <button
            type="button"
            onClick={onClose}
            className="px-4 sm:px-6 py-2 rounded-xl border-2 border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-700 midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10 transition-all active:scale-95"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 sm:px-8 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 midnight:from-cyan-600 midnight:to-purple-600 midnight:hover:from-cyan-700 midnight:hover:to-purple-700 purple:from-pink-600 purple:to-purple-600 purple:hover:from-pink-700 purple:hover:to-purple-700 text-white text-sm font-semibold transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
          >
            <span>Pay Fees</span>
            <span className="text-lg">→</span>
          </button>
        </div>
      </div>
    </div>
  );
}
