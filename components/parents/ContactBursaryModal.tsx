"use client";

import { Phone, Mail, MapPin, Clock, Copy, Check } from "lucide-react";
import { useState } from "react";
import Modal from "@/components/shared/Modal";
import Tooltip from "@/components/shared/Tooltip";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

interface ContactBursaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactBursaryModal({ isOpen, onClose }: ContactBursaryModalProps) {
  const { settings } = useSchoolSettings();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const financeContact = {
    name: "School Finance Department",
    phone: "+234 801 234 5678",
    alternatePhone: "+234 809 876 5432",
    email: "finance@educoschool.com",
    address: "Admin Block, Ground Floor, Room 102",
    officeHours: "Mon - Fri: 8:00 AM - 4:00 PM",
    accountName: settings.bankAccount?.accountName || "School Account",
    bankName: settings.bankAccount?.bankName || "First Bank Nigeria",
    accountNumber: settings.bankAccount?.accountNumber || "1234567890",
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Contact Finance"
      subtitle="Get help with payments and fee inquiries"
      icon={
        <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 midnight:from-cyan-500 midnight:to-cyan-600 purple:from-pink-500 purple:to-pink-600">
          <Phone className="w-5 h-5 text-white" />
        </div>
      }
      maxWidth="md"
    >
      <div className="p-4 space-y-3">
        {/* Contact Cards - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Phone Card */}
          <div className="group p-2.5 rounded-xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100/30 dark:from-blue-900/30 dark:to-blue-800/20 midnight:from-cyan-900/30 midnight:to-cyan-800/20 purple:from-pink-900/30 purple:to-pink-800/20 border border-blue-200/40 dark:border-blue-500/20 midnight:border-cyan-500/20 purple:border-pink-500/20 hover:border-blue-400/60 dark:hover:border-blue-400/40 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <a
                  href={`tel:${financeContact.phone.replace(/\s/g, "")}`}
                  className="p-1.5 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0"
                >
                  <Phone className="w-3.5 h-3.5 text-white" />
                </a>
                <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Phone</span>
              </div>
              <Tooltip content={copiedField === "phone" ? "Copied!" : "Copy"}>
                <button
                  type="button"
                  onClick={() => handleCopy(financeContact.phone, "phone")}
                  className="p-1 rounded-md hover:bg-white/60 dark:hover:bg-[#22262e]/60 transition-colors cursor-pointer shrink-0"
                >
                  {copiedField === "phone" ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </Tooltip>
            </div>
            <a
              href={`tel:${financeContact.phone.replace(/\s/g, "")}`}
              className="block font-medium text-gray-900 dark:text-white text-xs hover:text-blue-600 dark:hover:text-blue-400 transition-colors truncate"
            >
              {financeContact.phone}
            </a>
          </div>

          {/* Email Card */}
          <div className="group p-2.5 rounded-xl overflow-hidden bg-gradient-to-br from-green-50 to-green-100/30 dark:from-green-900/30 dark:to-green-800/20 midnight:from-emerald-900/30 midnight:to-emerald-800/20 purple:from-emerald-900/30 purple:to-emerald-800/20 border border-green-200/40 dark:border-green-500/20 midnight:border-emerald-500/20 purple:border-emerald-500/20 hover:border-green-400/60 dark:hover:border-green-400/40 transition-all duration-200 hover:shadow-md">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <a
                  href={`mailto:${financeContact.email}`}
                  className="p-1.5 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-sm group-hover:scale-105 transition-transform duration-200 shrink-0"
                >
                  <Mail className="w-3.5 h-3.5 text-white" />
                </a>
                <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Email</span>
              </div>
              <Tooltip content={copiedField === "email" ? "Copied!" : "Copy"}>
                <button
                  type="button"
                  onClick={() => handleCopy(financeContact.email, "email")}
                  className="p-1 rounded-md hover:bg-white/60 dark:hover:bg-[#22262e]/60 transition-colors cursor-pointer shrink-0"
                >
                  {copiedField === "email" ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </Tooltip>
            </div>
            <Tooltip content={financeContact.email}>
              <a
                href={`mailto:${financeContact.email}`}
                className="block font-medium text-gray-900 dark:text-white text-xs hover:text-green-600 dark:hover:text-green-400 transition-colors truncate w-full"
              >
                {financeContact.email}
              </a>
            </Tooltip>
          </div>

          {/* Office Location Card */}
          <div className="p-2.5 rounded-xl overflow-hidden bg-gradient-to-br from-purple-50 to-purple-100/30 dark:from-purple-900/30 dark:to-purple-800/20 midnight:from-violet-900/30 midnight:to-violet-800/20 purple:from-violet-900/30 purple:to-violet-800/20 border border-purple-200/40 dark:border-purple-500/20 midnight:border-violet-500/20 purple:border-violet-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Location</span>
              </div>
              <Tooltip content={copiedField === "address" ? "Copied!" : "Copy"}>
                <button
                  type="button"
                  onClick={() => handleCopy(financeContact.address, "address")}
                  className="p-1 rounded-md hover:bg-white/60 dark:hover:bg-[#22262e]/60 transition-colors cursor-pointer shrink-0"
                >
                  {copiedField === "address" ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </Tooltip>
            </div>
            <Tooltip content={financeContact.address}>
              <p className="font-medium text-gray-900 dark:text-white text-xs truncate w-full cursor-default">
                {financeContact.address}
              </p>
            </Tooltip>
          </div>

          {/* Office Hours Card */}
          <div className="p-2.5 rounded-xl overflow-hidden bg-gradient-to-br from-orange-50 to-orange-100/30 dark:from-orange-900/30 dark:to-orange-800/20 midnight:from-amber-900/30 midnight:to-amber-800/20 purple:from-amber-900/30 purple:to-amber-800/20 border border-orange-200/40 dark:border-orange-500/20 midnight:border-amber-500/20 purple:border-amber-500/20">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 min-w-0">
                <div className="p-1.5 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-sm shrink-0">
                  <Clock className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Hours</span>
              </div>
              <Tooltip content={copiedField === "hours" ? "Copied!" : "Copy"}>
                <button
                  type="button"
                  onClick={() => handleCopy(financeContact.officeHours, "hours")}
                  className="p-1 rounded-md hover:bg-white/60 dark:hover:bg-[#22262e]/60 transition-colors cursor-pointer shrink-0"
                >
                  {copiedField === "hours" ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3 text-gray-400" />}
                </button>
              </Tooltip>
            </div>
            <Tooltip content={financeContact.officeHours}>
              <p className="font-medium text-gray-900 dark:text-white text-xs truncate w-full cursor-default">
                {financeContact.officeHours}
              </p>
            </Tooltip>
          </div>
        </div>

        {/* Bank Account Details */}
        <div className="p-3.5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/80 dark:to-gray-700/50 midnight:from-gray-800/80 midnight:to-gray-700/50 purple:from-gray-800/80 purple:to-gray-700/50 border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <h4 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Bank Account Details
          </h4>
          <div className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">Bank</span>
              <Tooltip content={financeContact.bankName}>
                <span className="font-semibold text-gray-900 dark:text-white text-sm truncate text-right">
                  {financeContact.bankName}
                </span>
              </Tooltip>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">Account Name</span>
              <Tooltip content={financeContact.accountName}>
                <span className="font-semibold text-gray-900 dark:text-white text-sm truncate text-right">
                  {financeContact.accountName}
                </span>
              </Tooltip>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">Account No.</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-semibold text-gray-900 dark:text-white text-sm tracking-wide">
                  {financeContact.accountNumber}
                </span>
                <Tooltip content={copiedField === "account" ? "Copied!" : "Copy account number"}>
                  <button
                    type="button"
                    onClick={() => handleCopy(financeContact.accountNumber, "account")}
                    className="p-1.5 rounded-md hover:bg-gray-200/80 dark:hover:bg-[#2a2d35]/80 transition-colors cursor-pointer"
                  >
                    {copiedField === "account" ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
