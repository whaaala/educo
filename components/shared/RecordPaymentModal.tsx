"use client";

import { useState, useEffect, useRef } from "react";
import Modal from "./Modal";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextarea";
import ModernCalendar from "./ModernCalendar";
import {
  CreditCard,
  Banknote,
  Building2,
  Smartphone,
  CheckCircle2,
  Calendar,
  Hash,
  FileText,
  GraduationCap,
  AlertCircle,
  Receipt,
  Percent,
  Tag,
  type LucideIcon,
} from "lucide-react";

export interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  feeRecordId: string;
  parentName: string;
  parentId: string;
  childName: string;
  childId: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  balance: number;
  money: (amount: number) => string;
  onRecordPayment?: (data: PaymentData) => void;
  // Customization props
  title?: string;
  headerIcon?: LucideIcon;
  successTitle?: string;
  successMessage?: string;
  submitButtonText?: string;
  cancelButtonText?: string;
  processingText?: string;
  showDiscountSection?: boolean;
  showProgressBar?: boolean;
  showSummary?: boolean;
  showQuickAmountButtons?: boolean;
  discountSectionLabel?: string;
  paymentAmountLabel?: string;
  paymentMethodLabel?: string;
  paymentDateLabel?: string;
  referenceLabel?: string;
  notesLabel?: string;
  summaryLabel?: string;
  currencyPrefix?: string;
}

export interface PaymentData {
  feeRecordId: string;
  amount: number;
  discount: number;
  discountType: "percentage" | "fixed";
  paymentMethod: string;
  paymentDate: string;
  referenceNumber: string;
  notes: string;
}

const PAYMENT_METHODS = [
  { id: "Cash", label: "Cash", icon: <Banknote className="w-5 h-5" />, color: "green" },
  { id: "Bank Transfer", label: "Bank Transfer", icon: <Building2 className="w-5 h-5" />, color: "blue" },
  { id: "Card", label: "Card Payment", icon: <CreditCard className="w-5 h-5" />, color: "purple" },
  { id: "POS", label: "POS Terminal", icon: <Smartphone className="w-5 h-5" />, color: "orange" },
];

export default function RecordPaymentModal({
  isOpen,
  onClose,
  feeRecordId,
  parentName,
  parentId,
  childName,
  childId,
  feeType,
  amount,
  paidAmount,
  balance,
  money,
  onRecordPayment,
  // Customization props with defaults
  title = "Record Payment",
  headerIcon: HeaderIcon = CreditCard,
  successTitle = "Payment Recorded!",
  successMessage,
  submitButtonText = "Record Payment",
  cancelButtonText = "Cancel",
  processingText = "Processing...",
  showDiscountSection = true,
  showProgressBar = true,
  showSummary = true,
  showQuickAmountButtons = true,
  discountSectionLabel = "Apply Discount",
  paymentAmountLabel = "Payment Amount",
  paymentMethodLabel = "Payment Method",
  paymentDateLabel = "Payment Date",
  referenceLabel = "Reference No.",
  notesLabel = "Notes",
  summaryLabel = "Payment Summary",
  currencyPrefix = "NGN",
}: RecordPaymentModalProps) {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Discount state
  const [enableDiscount, setEnableDiscount] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">("percentage");

  const dateInputRef = useRef<HTMLButtonElement>(null);

  // Calculate discount amount
  const calculateDiscountAmount = (): number => {
    if (!enableDiscount || !discountValue || parseFloat(discountValue) <= 0) return 0;
    const discountVal = parseFloat(discountValue);
    if (discountType === "percentage") {
      return (balance * discountVal) / 100;
    }
    return discountVal;
  };

  const discountAmount = calculateDiscountAmount();
  const effectiveBalance = Math.max(0, balance - discountAmount);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setPaymentAmount("");
      setPaymentMethod("Cash");
      setPaymentDate(new Date().toISOString().split("T")[0]);
      setReferenceNumber("");
      setNotes("");
      setIsProcessing(false);
      setIsSuccess(false);
      setErrors({});
      setEnableDiscount(false);
      setDiscountValue("");
      setDiscountType("percentage");
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    } else if (parseFloat(paymentAmount) > effectiveBalance) {
      newErrors.amount = `Amount cannot exceed outstanding balance of ${money(effectiveBalance)}`;
    }

    if (!paymentDate) {
      newErrors.date = "Please select a payment date";
    }

    if (paymentMethod !== "Cash" && !referenceNumber.trim()) {
      newErrors.reference = "Reference number is required for non-cash payments";
    }

    if (enableDiscount && discountValue) {
      const discountVal = parseFloat(discountValue);
      if (discountType === "percentage" && discountVal > 100) {
        newErrors.discount = "Percentage discount cannot exceed 100%";
      } else if (discountType === "fixed" && discountVal > balance) {
        newErrors.discount = `Discount cannot exceed outstanding balance of ${money(balance)}`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const paymentData: PaymentData = {
        feeRecordId,
        amount: parseFloat(paymentAmount),
        discount: discountAmount,
        discountType,
        paymentMethod,
        paymentDate,
        referenceNumber: referenceNumber.trim(),
        notes: notes.trim(),
      };

      onRecordPayment?.(paymentData);
      setIsSuccess(true);

      // Close modal after showing success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Error recording payment:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuickAmount = (percentage: number) => {
    const quickAmount = (effectiveBalance * percentage) / 100;
    setPaymentAmount(quickAmount.toString());
    if (errors.amount) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.amount;
        return newErrors;
      });
    }
  };

  const getMethodColor = (methodId: string) => {
    const method = PAYMENT_METHODS.find((m) => m.id === methodId);
    return method?.color || "gray";
  };

  // Success state
  if (isSuccess) {
    const totalDeducted = parseFloat(paymentAmount) + discountAmount;
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="" maxWidth="sm">
        <div className="flex flex-col items-center justify-center py-8">
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-4 animate-in zoom-in duration-300">
            <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold text-ink mb-2">
            {successTitle}
          </h3>
          <p className="text-muted text-center mb-2">
            {successMessage || `Successfully recorded ${money(parseFloat(paymentAmount))} payment`}
          </p>
          {discountAmount > 0 && (
            <p className="text-sm text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400 mb-2">
              Discount applied: {money(discountAmount)}
            </p>
          )}
          <p className="text-sm text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400">
            New balance: {money(Math.max(0, balance - totalDeducted))}
          </p>
        </div>
      </Modal>
    );
  }

  // Footer content - action buttons
  const footerContent = (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={onClose}
        disabled={isProcessing}
        className="flex-1 py-3 rounded-xl font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 bg-surface-2 hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {cancelButtonText}
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isProcessing || !paymentAmount || parseFloat(paymentAmount) <= 0}
        className="flex-1 py-3 rounded-xl font-semibold text-white bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
      >
        {isProcessing ? (
          <>
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            {processingText}
          </>
        ) : (
          <>
            <HeaderIcon className="w-5 h-5" />
            {submitButtonText}
          </>
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="md"
      footer={footerContent}
    >
      <div className="space-y-6">
        {/* Fee Record Info */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-4 border border-blue-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-start gap-4">
            <div className="flex items-center gap-3 flex-1">
              <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              </div>
              <div>
                <p className="font-semibold text-ink">{childName}</p>
                <p className="text-sm text-muted">
                  {feeType} | Parent: {parentName}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted mb-1">Outstanding</p>
              <p className="text-xl font-bold text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400">
                {money(balance)}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          {showProgressBar && (
          <div className="mt-4">
            <div className="flex justify-between text-xs text-muted mb-1">
              <span>Paid: {money(paidAmount)}</span>
              <span>Total: {money(amount)}</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 dark:bg-green-400 rounded-full transition-all duration-500"
                style={{ width: `${(paidAmount / amount) * 100}%` }}
              />
            </div>
          </div>
          )}
        </div>

        {/* Discount Section */}
        {showDiscountSection && (
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-800 dark:to-gray-800 rounded-xl p-4 border border-orange-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Tag className="w-4 h-4 text-orange-600 dark:text-orange-400" />
              </div>
              <span className="font-medium text-ink">{discountSectionLabel}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enableDiscount}
                onChange={(e) => {
                  setEnableDiscount(e.target.checked);
                  if (!e.target.checked) {
                    setDiscountValue("");
                    setErrors((prev) => {
                      const newErrors = { ...prev };
                      delete newErrors.discount;
                      return newErrors;
                    });
                  }
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-orange-300/20 dark:peer-focus:ring-orange-800/20 rounded-full peer dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 peer-checked:bg-orange-500" />
            </label>
          </div>

          {enableDiscount && (
            <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
              {/* Discount Type Toggle */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setDiscountType("percentage")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    discountType === "percentage"
                      ? "bg-orange-500 text-white"
                      : "bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                  }`}
                >
                  <Percent className="w-4 h-4" />
                  Percentage
                </button>
                <button
                  type="button"
                  onClick={() => setDiscountType("fixed")}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                    discountType === "fixed"
                      ? "bg-orange-500 text-white"
                      : "bg-white dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-600 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                  }`}
                >
                  <span className="font-bold">₦</span>
                  Fixed Amount
                </button>
              </div>

              {/* Discount Input */}
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">
                  {discountType === "percentage" ? "%" : "NGN"}
                </span>
                <input
                  type="text"
                  value={discountValue}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9.]/g, "");
                    setDiscountValue(value);
                    if (errors.discount) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.discount;
                        return newErrors;
                      });
                    }
                  }}
                  placeholder={discountType === "percentage" ? "Enter percentage" : "Enter amount"}
                  className={`w-full h-12 ${discountType === "percentage" ? "pl-10" : "pl-14"} pr-4 rounded-xl border ${
                    errors.discount
                      ? "border-red-500 dark:border-red-400"
                      : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                  } bg-surface text-ink font-semibold placeholder:text-gray-400 placeholder:font-normal focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all`}
                />
              </div>
              {errors.discount && (
                <p className="text-xs text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.discount}
                </p>
              )}

              {/* Discount Preview */}
              {discountAmount > 0 && (
                <div className="flex items-center justify-between p-2 bg-orange-100/50 dark:bg-orange-900/20 rounded-lg">
                  <span className="text-sm text-orange-700 dark:text-orange-300">Discount Amount:</span>
                  <span className="font-semibold text-orange-700 dark:text-orange-300">
                    -{money(discountAmount)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        )}

        {/* Payment Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
            {paymentAmountLabel} <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted font-medium">
              {currencyPrefix}
            </span>
            <input
              type="text"
              value={paymentAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                setPaymentAmount(value);
                if (errors.amount) {
                  setErrors((prev) => {
                    const newErrors = { ...prev };
                    delete newErrors.amount;
                    return newErrors;
                  });
                }
              }}
              placeholder="0.00"
              className={`w-full h-12 pl-14 pr-4 rounded-xl border ${
                errors.amount
                  ? "border-red-500 dark:border-red-400"
                  : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
              } bg-surface text-ink text-lg font-semibold placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-xs text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {errors.amount}
            </p>
          )}

          {/* Quick amount buttons */}
          {showQuickAmountButtons && (
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={() => handleQuickAmount(25)}
              className="flex-1 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 bg-surface-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 transition-colors cursor-pointer"
            >
              25%
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(50)}
              className="flex-1 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 bg-surface-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 transition-colors cursor-pointer"
            >
              50%
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(75)}
              className="flex-1 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 bg-surface-2 rounded-lg hover:bg-gray-200 dark:hover:bg-[#2a2d35] midnight:hover:bg-cyan-500/15 purple:hover:bg-pink-500/15 transition-colors cursor-pointer"
            >
              75%
            </button>
            <button
              type="button"
              onClick={() => handleQuickAmount(100)}
              className="flex-1 py-1.5 text-xs font-medium text-white bg-green-600 dark:bg-green-500 rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors cursor-pointer"
            >
              Full
            </button>
          </div>
          )}
          {showDiscountSection && enableDiscount && discountAmount > 0 && (
            <p className="mt-1 text-xs text-muted">
              Effective balance after discount: <span className="font-semibold">{money(effectiveBalance)}</span>
            </p>
          )}
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
            {paymentMethodLabel}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => setPaymentMethod(method.id)}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                  paymentMethod === method.id
                    ? `border-${method.color}-500 bg-${method.color}-50 dark:bg-${method.color}-900/20`
                    : "border-line hover:border-gray-300 dark:hover:border-gray-600 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    paymentMethod === method.id
                      ? `bg-${method.color}-100 dark:bg-${method.color}-900/30 text-${method.color}-600 dark:text-${method.color}-400`
                      : "bg-surface-2 text-muted"
                  }`}
                >
                  {method.icon}
                </div>
                <span
                  className={`text-sm font-medium ${
                    paymentMethod === method.id
                      ? "text-ink"
                      : "text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300"
                  }`}
                >
                  {method.label}
                </span>
                {paymentMethod === method.id && (
                  <CheckCircle2 className={`w-5 h-5 ml-auto text-${method.color}-500`} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Payment Date & Reference */}
        <div className="grid grid-cols-2 gap-4">
          {/* Payment Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
              {paymentDateLabel} <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <button
                type="button"
                ref={dateInputRef}
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`w-full h-12 px-4 rounded-xl border ${
                  errors.date
                    ? "border-red-500 dark:border-red-400"
                    : "border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
                } bg-surface text-left flex items-center gap-2 hover:border-gray-400 dark:hover:border-gray-500 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40 transition-colors cursor-pointer`}
              >
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className={paymentDate ? "text-ink" : "text-gray-400"}>
                  {paymentDate
                    ? new Date(paymentDate).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "Select date"}
                </span>
              </button>
              {showDatePicker && (
                <ModernCalendar
                  value={paymentDate || ""}
                  onChange={(date: string) => {
                    setPaymentDate(date);
                    setShowDatePicker(false);
                    if (errors.date) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.date;
                        return newErrors;
                      });
                    }
                  }}
                  onClose={() => setShowDatePicker(false)}
                  triggerRef={dateInputRef as React.RefObject<HTMLElement>}
                />
              )}
            </div>
            {errors.date && (
              <p className="mt-1 text-xs text-red-500 dark:text-red-400 midnight:text-red-400 purple:text-red-400">{errors.date}</p>
            )}
          </div>

          {/* Reference Number */}
          <FormInput
            label={`${referenceLabel}${paymentMethod !== "Cash" ? " *" : ""}`}
            icon={<Hash className="w-full h-full" />}
            value={referenceNumber}
            onChange={(value) => {
              setReferenceNumber(value);
              if (errors.reference) {
                setErrors((prev) => {
                  const newErrors = { ...prev };
                  delete newErrors.reference;
                  return newErrors;
                });
              }
            }}
            placeholder="Enter reference"
            required={paymentMethod !== "Cash"}
            error={errors.reference}
          />
        </div>

        {/* Notes */}
        <FormTextarea
          label={notesLabel}
          icon={<FileText className="w-full h-full" />}
          value={notes}
          onChange={setNotes}
          placeholder="Add any additional notes..."
          rows={2}
          optional
        />

        {/* Summary */}
        {showSummary && paymentAmount && parseFloat(paymentAmount) > 0 && (
          <div className="bg-gray-50 dark:bg-[#1a1d24] midnight:bg-[#0a0e27]/50 purple:bg-[#1a0b2e]/50 rounded-xl p-4 border border-line">
            <div className="flex items-center gap-2 mb-3">
              <Receipt className="w-5 h-5 text-muted" />
              <span className="font-medium text-ink">{summaryLabel}</span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Payment Amount</span>
                <span className="font-semibold text-ink">
                  {money(parseFloat(paymentAmount))}
                </span>
              </div>
              {enableDiscount && discountAmount > 0 && (
                <div className="flex justify-between text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400">
                  <span>Discount Applied</span>
                  <span className="font-semibold">
                    -{money(discountAmount)}
                    {discountType === "percentage" && discountValue && (
                      <span className="text-xs ml-1">({discountValue}%)</span>
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted">Current Balance</span>
                <span className="text-ink">{money(balance)}</span>
              </div>
              <div className="border-t border-line pt-2 flex justify-between">
                <span className="text-muted">New Balance</span>
                <span
                  className={`font-semibold ${
                    balance - parseFloat(paymentAmount) - discountAmount <= 0
                      ? "text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400"
                      : "text-orange-600 dark:text-orange-400"
                  }`}
                >
                  {money(Math.max(0, balance - parseFloat(paymentAmount) - discountAmount))}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
