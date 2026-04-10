"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CreditCard,
  Building2,
  Banknote,
  CheckCircle2,
  AlertCircle,
  Clock,
  Lock,
  Shield,
  Copy,
  Wallet,
  Receipt,
  ChevronDown,
  User,
  Calendar,
} from "lucide-react";
import Modal from "../shared/Modal";
import FormInput from "../shared/FormInput";
import FormButton from "../shared/FormButton";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

// Types
export interface FeeItem {
  id: string;
  childName: string;
  feeType: string;
  term: string;
  academicYear: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: "paid" | "partial" | "pending" | "overdue";
}

interface PayFeesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: (paymentDetails: PaymentDetails) => void;
  fees: FeeItem[];
  selectedFeeId?: string | null;
}

interface PaymentDetails {
  feeIds: string[];
  totalAmount: number;
  allocations: Record<string, number>;
  paymentMethod: "card" | "bank" | "cash";
  transactionRef?: string;
}

type PaymentMethod = "card" | "bank" | "cash";

export default function PayFeesModal({
  isOpen,
  onClose,
  onPaymentComplete,
  fees,
  selectedFeeId = null,
}: PayFeesModalProps) {
  const { settings } = useSchoolSettings();
  const currencyCode = settings.currency || "NGN";

  const { money, currencySymbol } = useMemo(() => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: currencyCode,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 0,
    });

    const symbol =
      formatter.formatToParts(0).find((p) => p.type === "currency")?.value ??
      currencyCode;

    return {
      money: (amount: number) => formatter.format(amount),
      currencySymbol: symbol,
    };
  }, [currencyCode]);

  // Filter to only unpaid fees
  const unpaidFees = useMemo(() =>
    fees.filter(f => f.balance > 0),
    [fees]
  );

  // State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [expandedFees, setExpandedFees] = useState<boolean>(true);

  // Card form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Initialize allocations when modal opens or fees change
  useEffect(() => {
    if (isOpen && unpaidFees.length > 0) {
      const initialAllocations: Record<string, number> = {};

      if (selectedFeeId) {
        // If specific fee selected, only allocate to that fee
        const fee = unpaidFees.find(f => f.id === selectedFeeId);
        if (fee) {
          initialAllocations[fee.id] = fee.balance;
        }
      } else {
        // Allocate full amount to all fees
        unpaidFees.forEach(fee => {
          initialAllocations[fee.id] = fee.balance;
        });
      }

      setAllocations(initialAllocations);
    }
  }, [isOpen, unpaidFees, selectedFeeId]);

  // Calculate totals
  const totalOutstanding = useMemo(() =>
    unpaidFees.reduce((sum, f) => sum + f.balance, 0),
    [unpaidFees]
  );

  const totalAllocated = useMemo(() =>
    Object.values(allocations).reduce((sum, val) => sum + val, 0),
    [allocations]
  );

  // Helpers
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(" ") : value;
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleAllocationChange = (feeId: string, value: string, maxAmount: number) => {
    const numValue = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    const clampedValue = Math.min(numValue, maxAmount);
    setAllocations(prev => ({ ...prev, [feeId]: clampedValue }));
  };

  const handleQuickFill = (percentage: number) => {
    const newAllocations: Record<string, number> = {};
    unpaidFees.forEach(fee => {
      newAllocations[fee.id] = Math.floor(fee.balance * (percentage / 100));
    });
    setAllocations(newAllocations);
  };

  const handlePayment = async () => {
    if (totalAllocated <= 0) return;

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const paymentDetails: PaymentDetails = {
      feeIds: Object.keys(allocations).filter(id => allocations[id] > 0),
      totalAmount: totalAllocated,
      allocations,
      paymentMethod,
      transactionRef: `TRX-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    };

    setIsProcessing(false);
    onPaymentComplete(paymentDetails);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setAllocations({});
      setCardNumber("");
      setCardName("");
      setExpiryDate("");
      setCvv("");
      onClose();
    }
  };

  const getStatusConfig = (status: FeeItem["status"]) => {
    const config = {
      paid: {
        bg: "bg-green-100 dark:bg-green-900/30",
        text: "text-green-700 dark:text-green-400",
        icon: <CheckCircle2 className="w-3 h-3" />,
        label: "Paid",
      },
      partial: {
        bg: "bg-yellow-100 dark:bg-yellow-900/30",
        text: "text-yellow-700 dark:text-yellow-400",
        icon: <Clock className="w-3 h-3" />,
        label: "Partial",
      },
      pending: {
        bg: "bg-blue-100 dark:bg-blue-900/30",
        text: "text-blue-700 dark:text-blue-400",
        icon: <Clock className="w-3 h-3" />,
        label: "Pending",
      },
      overdue: {
        bg: "bg-red-100 dark:bg-red-900/30",
        text: "text-red-700 dark:text-red-400",
        icon: <AlertCircle className="w-3 h-3" />,
        label: "Overdue",
      },
    };
    return config[status];
  };

  const paymentMethods = [
    {
      id: "card" as const,
      label: "Card",
      icon: CreditCard,
      description: "Debit or Credit Card",
    },
    {
      id: "bank" as const,
      label: "Bank Transfer",
      icon: Building2,
      description: "Direct Bank Transfer",
    },
    {
      id: "cash" as const,
      label: "Cash",
      icon: Banknote,
      description: "Pay at School Office",
    },
  ];

  const footer = (
    <div className="flex gap-3">
      <FormButton
        type="button"
        onClick={handleClose}
        variant="secondary"
        className="flex-1"
      >
        Cancel
      </FormButton>

      <FormButton
        type="button"
        onClick={handlePayment}
        variant="primary"
        className={`flex-1 !bg-gradient-to-r !from-green-600 !to-emerald-600 hover:!from-green-700 hover:!to-emerald-700 dark:!from-green-500 dark:!to-emerald-500 ${isProcessing || totalAllocated <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Processing...
          </span>
        ) : (
          `Pay ${money(totalAllocated)}`
        )}
      </FormButton>
    </div>
  );

  if (unpaidFees.length === 0) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Pay Fees"
        subtitle="No outstanding fees"
        icon={<Wallet className="w-5 h-5 sm:w-6 sm:h-6" />}
        maxWidth="lg"
      >
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            All Fees Paid!
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            There are no outstanding fees to pay at this time.
          </p>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Pay Fees"
      subtitle="Select fees and payment method"
      icon={<Wallet className="w-5 h-5 sm:w-6 sm:h-6" />}
      footer={footer}
      maxWidth="2xl"
      preventBackdropClose={isProcessing}
    >
      <div className="space-y-6">
        {/* Total Outstanding Card */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 midnight:from-gray-800 midnight:via-cyan-950/50 midnight:to-gray-800 purple:from-gray-800 purple:via-pink-950/50 purple:to-gray-800 p-4 sm:p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                Total Outstanding
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-white">
                {money(totalOutstanding)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-medium mb-0.5">
                Paying Now
              </p>
              <p className="text-xl sm:text-2xl font-bold text-emerald-400">
                {money(totalAllocated)}
              </p>
            </div>
          </div>

          {/* Quick Fill Buttons */}
          <div className="flex gap-2">
            {[25, 50, 75, 100].map((pct) => {
              const isActive = totalAllocated === Math.floor(totalOutstanding * (pct / 100));
              return (
                <button
                  key={pct}
                  type="button"
                  onClick={() => handleQuickFill(pct)}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/30"
                      : "bg-white/10 text-gray-300 hover:bg-white/15 hover:text-white"
                  }`}
                >
                  {pct}%
                </button>
              );
            })}
          </div>
        </div>

        {/* Fee Allocations */}
        <div className="rounded-xl border border-gray-200 dark:border-gray-700/50 midnight:border-cyan-700/20 purple:border-pink-700/20 overflow-hidden">
          <button
            type="button"
            onClick={() => setExpandedFees(!expandedFees)}
            className="w-full flex items-center justify-between p-3.5 bg-gray-50/80 dark:bg-[#1a1d24]/30 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 cursor-pointer hover:bg-gray-100/80 dark:hover:bg-[#22262e]/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-green-100/80 dark:bg-green-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20">
                <Receipt className="w-4 h-4 text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-100 text-sm">
                Fee Breakdown ({unpaidFees.length} {unpaidFees.length === 1 ? "fee" : "fees"})
              </span>
            </div>
            <div className={`p-1 rounded-md transition-transform duration-200 ${expandedFees ? "rotate-180" : ""}`}>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </button>

          {expandedFees && (
            <div className="p-3 space-y-2.5 bg-white/50 dark:bg-[#0f1115]/20 midnight:bg-[#0a0e27]/20 purple:bg-[#1a0b2e]/20">
              {unpaidFees.map((fee) => {
                const statusConfig = getStatusConfig(fee.status);
                const allocation = allocations[fee.id] || 0;

                return (
                  <div
                    key={fee.id}
                    className="bg-white dark:bg-[#1a1d24]/80 midnight:bg-[#0f1330]/80 purple:bg-[#251340]/80 rounded-xl p-3.5 border border-gray-100 dark:border-gray-700/50 midnight:border-cyan-700/20 purple:border-pink-700/20 transition-all hover:shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-2.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                            {statusConfig.icon}
                            {statusConfig.label}
                          </span>
                        </div>
                        <p className="font-semibold text-gray-800 dark:text-white text-sm truncate">
                          {fee.feeType}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                          {fee.childName} • {fee.term} - {fee.academicYear}
                        </p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-3">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Balance</p>
                        <p className="font-bold text-gray-800 dark:text-white text-sm">
                          {money(fee.balance)}
                        </p>
                      </div>
                    </div>

                    {/* Allocation Input */}
                    <div className="flex items-center gap-2.5">
                      <div className="flex-1">
                        <div className="relative">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-6 h-6 rounded bg-gray-100 dark:bg-[#22262e] midnight:bg-cyan-900/30 purple:bg-pink-900/30">
                            <span className="text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 font-bold text-sm">{currencySymbol}</span>
                          </div>
                          <input
                            type="text"
                            value={allocation > 0 ? allocation.toLocaleString() : ""}
                            onChange={(e) => handleAllocationChange(fee.id, e.target.value, fee.balance)}
                            placeholder="0"
                            className="w-full h-[46px] pl-14 pr-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 midnight:placeholder:text-cyan-400/50 purple:placeholder:text-pink-400/50 focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 focus:border-blue-400 dark:focus:border-blue-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
                          />
                        </div>
                      </div>
                      <FormButton
                        type="button"
                        onClick={() => setAllocations(prev => ({ ...prev, [fee.id]: fee.balance }))}
                        variant="secondary"
                        className="!h-[46px] !px-4 !text-xs"
                      >
                        Pay Full
                      </FormButton>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment Method Selection */}
        <div>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Payment Method
          </p>

          <div className="grid grid-cols-3 gap-2.5">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`relative p-3 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? "border-green-400/50 dark:border-green-500/40 midnight:border-cyan-500/40 purple:border-pink-500/40 bg-gradient-to-br from-green-50 to-emerald-50/50 dark:from-green-950/40 dark:to-emerald-950/30 midnight:from-cyan-950/40 midnight:to-blue-950/30 purple:from-pink-950/40 purple:to-purple-950/30 shadow-sm"
                      : "border-gray-200/80 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/50 purple:bg-[#251340]/50 hover:bg-gray-50 dark:hover:bg-[#22262e]/80"
                  }`}
                >
                  {isSelected && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 midnight:bg-cyan-400 purple:bg-pink-400 flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}

                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-all duration-200 ${
                      isSelected
                        ? "bg-green-500 dark:bg-green-500 midnight:bg-cyan-500 purple:bg-pink-500 shadow-md shadow-green-500/20"
                        : "bg-gray-100 dark:bg-[#22262e]/80 group-hover:bg-gray-200 dark:group-hover:bg-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-200 ${
                        isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                  </div>

                  <p
                    className={`text-[11px] sm:text-xs font-semibold text-center transition-colors duration-200 ${
                      isSelected
                        ? "text-green-600 dark:text-green-400 midnight:text-cyan-400 purple:text-pink-400"
                        : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {method.label}
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-gray-400 dark:text-gray-500 text-center mt-0.5 hidden sm:block">
                    {method.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment Form Content */}
        <div>
          {/* Card Payment Form */}
          {paymentMethod === "card" && (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <FormInput
                  label="Cardholder Name"
                  icon={<User className="w-3.5 h-3.5" />}
                  iconBgColor="bg-green-100 dark:bg-green-900/30"
                  iconColor="text-green-600 dark:text-green-400"
                  value={cardName}
                  onChange={setCardName}
                  placeholder="John Doe"
                  type="text"
                />

                <FormInput
                  label="Card Number"
                  icon={<CreditCard className="w-3.5 h-3.5" />}
                  iconBgColor="bg-blue-100 dark:bg-blue-900/30"
                  iconColor="text-blue-600 dark:text-blue-400"
                  value={cardNumber}
                  onChange={(val) => setCardNumber(formatCardNumber(val))}
                  placeholder="0000 0000 0000 0000"
                  type="text"
                />

                <FormInput
                  label="Expiry Date"
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  iconBgColor="bg-orange-100 dark:bg-orange-900/30"
                  iconColor="text-orange-600 dark:text-orange-400"
                  value={expiryDate}
                  onChange={(val) => setExpiryDate(formatExpiryDate(val))}
                  placeholder="MM/YY"
                  type="text"
                />

                <FormInput
                  label="CVV"
                  icon={<Lock className="w-3.5 h-3.5" />}
                  iconBgColor="bg-purple-100 dark:bg-purple-900/30"
                  iconColor="text-purple-600 dark:text-purple-400"
                  value={cvv}
                  onChange={(val) => setCvv(val.replace(/\D/g, "").slice(0, 4))}
                  placeholder="***"
                  type="text"
                />
              </div>

              <div className="flex items-center justify-center gap-2 py-1">
                <Shield className="w-3.5 h-3.5 text-green-500 dark:text-green-400" />
                <span className="text-[11px] text-gray-500 dark:text-gray-400">
                  Secure payment • 256-bit encryption
                </span>
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {paymentMethod === "bank" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/30 overflow-hidden">
                <div className="bg-gradient-to-r from-green-50/80 to-emerald-50/60 dark:from-green-950/20 dark:to-emerald-950/10 px-4 py-3 border-b border-green-100/50 dark:border-green-800/20">
                  <p className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Transfer the exact amount to the account below
                  </p>
                </div>

                <div className="p-3 space-y-2 bg-white/50 dark:bg-[#0f1115]/20">
                  {[
                    { label: "Bank Name", value: settings.bankAccount.bankName },
                    { label: "Account Number", value: settings.bankAccount.accountNumber },
                    { label: "Account Name", value: settings.bankAccount.accountName },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-3 bg-white dark:bg-[#1a1d24]/60 rounded-xl border border-gray-100 dark:border-gray-700/30 hover:border-gray-200 dark:hover:border-gray-600/50 transition-colors"
                    >
                      <div>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-medium">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-gray-800 dark:text-white">
                          {item.value}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.value, item.label)}
                        className="p-2 rounded-lg bg-gray-50 dark:bg-[#22262e]/50 hover:bg-gray-100 dark:hover:bg-[#22262e] transition-all duration-200 cursor-pointer"
                      >
                        {copied === item.label ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>

                <div className="px-4 py-2.5 bg-gray-50/80 dark:bg-[#1a1d24]/30 border-t border-gray-100 dark:border-gray-700/30">
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 text-center">
                    Use your child&apos;s admission number as payment reference
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Cash Payment Info */}
          {paymentMethod === "cash" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="rounded-xl border border-gray-200/80 dark:border-gray-700/30 overflow-hidden">
                <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/60 dark:from-emerald-950/20 dark:to-teal-950/10 p-5 text-center">
                  <div className="w-12 h-12 rounded-xl bg-emerald-500 dark:bg-emerald-500/80 flex items-center justify-center mx-auto mb-3 shadow-md shadow-emerald-500/20">
                    <Banknote className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-800 dark:text-white text-sm mb-1.5">
                    Pay at School Office
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 max-w-xs mx-auto">
                    Visit the school bursar&apos;s office during working hours to make your cash payment.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-[#1a1d24]/60 rounded-xl text-xs border border-gray-100 dark:border-gray-700/30">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-gray-500 dark:text-gray-400">Office Hours:</span>
                    <span className="font-semibold text-gray-800 dark:text-white">8:00 AM - 4:00 PM</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
