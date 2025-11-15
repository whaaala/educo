"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CreditCard, DollarSign, CheckCircle, FileText } from "lucide-react";
import FormInput from "./FormInput";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentComplete: () => void;
  title?: string;
  itemType: string;
  amount: number;
  currency: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  onPaymentComplete,
  title = "Payment for Request",
  itemType,
  amount,
  currency,
}: PaymentModalProps) {
  const { settings } = useSchoolSettings();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "cash">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Form fields
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Handle mounting for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Scroll modal into view when it opens
  useEffect(() => {
    if (isOpen && modalRef.current) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [isOpen]);

  const handlePayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    onPaymentComplete();
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-start justify-center bg-black/60 backdrop-blur-md pt-4 pb-4 px-4 sm:px-6 overflow-y-auto">
      <div
        ref={modalRef}
        className="relative w-full max-w-3xl bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl sm:rounded-2xl shadow-2xl max-h-[calc(100vh-32px)] flex flex-col animate-in fade-in zoom-in duration-200"
      >
        {/* Header with Gradient */}
        <div className="flex-shrink-0 relative bg-gradient-to-r from-blue-500/90 to-indigo-500/90 dark:from-blue-500/80 dark:to-indigo-500/80 midnight:from-cyan-500/90 midnight:to-indigo-500/90 purple:from-pink-500/90 purple:to-indigo-500/90 px-4 sm:px-5 py-3 sm:py-4 rounded-t-xl sm:rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">
                  {title}
                </h2>
                <p className="text-xs text-white/80 mt-0.5">Complete payment to proceed</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors group cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5 text-white/80 group-hover:text-white transition-colors" />
            </button>
          </div>
        </div>

        {/* Order Summary Card */}
        <div className="px-4 sm:px-5 py-4 bg-gradient-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-800/30 midnight:from-cyan-900/10 midnight:to-cyan-800/5 purple:from-pink-900/10 purple:to-pink-800/5">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-cyan-950/30 midnight:to-cyan-900/30 purple:from-pink-950/30 purple:to-pink-900/30 rounded-xl p-5 border border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                Order Summary
              </h3>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                  Transcript Type:
                </span>
                <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 capitalize text-sm">
                  {itemType}
                </span>
              </div>

              <div className="border-t border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Total Amount:
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                    {currency} {amount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4">
          <div className="space-y-5">
            {/* Payment Method Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-3">
                Select Payment Method
              </label>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                    paymentMethod === "card"
                      ? "border-blue-600 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500 bg-blue-50 dark:bg-blue-950/30 midnight:bg-cyan-950/30 purple:bg-pink-950/30"
                      : "border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <CreditCard className={`w-6 h-6 mx-auto mb-2 ${
                    paymentMethod === "card"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-gray-400"
                  }`} />
                  <span className={`text-sm font-medium block ${
                    paymentMethod === "card"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    Card
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                    paymentMethod === "bank"
                      ? "border-blue-600 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500 bg-blue-50 dark:bg-blue-950/30 midnight:bg-cyan-950/30 purple:bg-pink-950/30"
                      : "border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <DollarSign className={`w-6 h-6 mx-auto mb-2 ${
                    paymentMethod === "bank"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-gray-400"
                  }`} />
                  <span className={`text-sm font-medium block ${
                    paymentMethod === "bank"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    Bank
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                    paymentMethod === "cash"
                      ? "border-blue-600 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500 bg-blue-50 dark:bg-blue-950/30 midnight:bg-cyan-950/30 purple:bg-pink-950/30"
                      : "border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <CheckCircle className={`w-6 h-6 mx-auto mb-2 ${
                    paymentMethod === "cash"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-gray-400"
                  }`} />
                  <span className={`text-sm font-medium block ${
                    paymentMethod === "cash"
                      ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                      : "text-gray-600 dark:text-gray-400"
                  }`}>
                    Cash
                  </span>
                </button>
              </div>
            </div>

            {/* Payment Details - Card */}
            {paymentMethod === "card" && (
              <div className="space-y-4">
                <FormInput
                  label="Card Number"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="1234 5678 9012 3456"
                  icon={<CreditCard className="w-2.5 h-2.5" />}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Expiry Date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY"
                    icon={<CreditCard className="w-2.5 h-2.5" />}
                  />

                  <FormInput
                    label="CVV"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="123"
                    icon={<CreditCard className="w-2.5 h-2.5" />}
                  />
                </div>
              </div>
            )}

            {/* Payment Details - Bank Transfer */}
            {paymentMethod === "bank" && (
              <div className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30">
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-3">
                  Transfer to the following bank account:
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Bank Name:</span>
                    <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{settings.bankAccount.bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Account Number:</span>
                    <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{settings.bankAccount.accountNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Account Name:</span>
                    <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">{settings.bankAccount.accountName}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Details - Cash */}
            {paymentMethod === "cash" && (
              <div className="bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30">
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">
                  Please visit the school bursar's office to make cash payment. Bring your student ID and reference number.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer - Action Buttons */}
        <div className="flex-shrink-0 px-4 sm:px-5 py-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 rounded-b-xl sm:rounded-b-2xl">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-6 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-700 purple:border-pink-700 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePayment}
              disabled={isProcessing}
              className="flex-1 px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:from-cyan-600 midnight:to-cyan-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:from-pink-600 purple:to-pink-700 purple:hover:from-pink-700 purple:hover:to-pink-800 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 cursor-pointer"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                `Pay ${currency} ${amount.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
