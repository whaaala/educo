"use client";

import { useState } from "react";
import {
  CreditCard,
  Building2,
  Banknote,
  Lock,
  Shield,
  CheckCircle2,
  Copy,
  Wallet,
} from "lucide-react";
import Modal from "./Modal";
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
  title = "Complete Payment",
  itemType,
  amount,
  currency,
}: PaymentModalProps) {
  const { settings } = useSchoolSettings();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "cash">("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Form fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");

  // Format card number with spaces
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

  // Format expiry date
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

  const handlePayment = async () => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsProcessing(false);
    onPaymentComplete();
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
      <button
        type="button"
        onClick={onClose}
        disabled={isProcessing}
        className="flex-1 px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 midnight:hover:bg-gray-800 purple:hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        Cancel
      </button>

      <button
        type="button"
        onClick={handlePayment}
        disabled={isProcessing}
        className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600 midnight:from-cyan-500 midnight:to-blue-600 midnight:hover:from-cyan-600 midnight:hover:to-blue-700 purple:from-pink-500 purple:to-purple-600 purple:hover:from-pink-600 purple:hover:to-purple-700 text-white font-semibold shadow-lg shadow-blue-500/25 dark:shadow-blue-500/20 midnight:shadow-cyan-500/20 purple:shadow-pink-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
      >
        {isProcessing ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
          `Pay ${currency}${amount.toLocaleString()}`
        )}
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle="Secure payment for your request"
      icon={<Wallet className="w-5 h-5 sm:w-6 sm:h-6" />}
      footer={footer}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Amount Summary Card */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 midnight:from-gray-800 midnight:to-cyan-950/50 purple:from-gray-800 purple:to-pink-950/50 p-5">
          {/* Card pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
          </div>

          <div className="relative">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
              Payment For
            </p>
            <p className="text-white font-medium text-sm mb-4 line-clamp-2">
              {itemType}
            </p>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Total Amount
                </p>
                <p className="text-3xl font-bold text-white">
                  {currency}{amount.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-400">
                <Shield className="w-4 h-4" />
                <span className="text-xs font-medium">Secure</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div>
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-3">
            Select Payment Method
          </p>

          <div className="grid grid-cols-3 gap-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMethod === method.id;

              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer group ${
                    isSelected
                      ? "border-blue-500 dark:border-blue-400 midnight:border-cyan-400 purple:border-pink-400 bg-blue-50 dark:bg-blue-950/30 midnight:bg-cyan-950/30 purple:bg-pink-950/30 shadow-md"
                      : "border-gray-200 dark:border-gray-700 midnight:border-gray-700 purple:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800"
                  }`}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-400 midnight:to-blue-500 purple:from-pink-400 purple:to-purple-500 flex items-center justify-center shadow-md">
                      <CheckCircle2 className="w-3 h-3 text-white" />
                    </div>
                  )}

                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-transform group-hover:scale-105 ${
                      isSelected
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-400 midnight:to-blue-500 purple:from-pink-400 purple:to-purple-500 shadow-md"
                        : "bg-gray-100 dark:bg-gray-700 midnight:bg-gray-700 purple:bg-gray-700"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isSelected ? "text-white" : "text-gray-500 dark:text-gray-400"
                      }`}
                    />
                  </div>

                  <p
                    className={`text-xs font-semibold text-center ${
                      isSelected
                        ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                        : "text-gray-600 dark:text-gray-400"
                    }`}
                  >
                    {method.label}
                  </p>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center mt-0.5 hidden sm:block">
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
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mb-1.5">
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/50 purple:border-pink-700/50 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-400/20 purple:focus:ring-pink-400/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-400 purple:focus:border-pink-400 transition-all text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mb-1.5">
                  Card Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={19}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/50 purple:border-pink-700/50 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-400/20 purple:focus:ring-pink-400/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-400 purple:focus:border-pink-400 transition-all text-sm font-mono"
                  />
                  <CreditCard className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                    placeholder="MM/YY"
                    maxLength={5}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/50 purple:border-pink-700/50 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-400/20 purple:focus:ring-pink-400/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-400 purple:focus:border-pink-400 transition-all text-sm font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 mb-1.5">
                    CVV
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                      placeholder="***"
                      maxLength={4}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/50 purple:border-pink-700/50 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 midnight:focus:ring-cyan-400/20 purple:focus:ring-pink-400/20 focus:border-blue-500 dark:focus:border-blue-400 midnight:focus:border-cyan-400 purple:focus:border-pink-400 transition-all text-sm font-mono"
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Security badge */}
              <div className="flex items-center justify-center gap-2 pt-2">
                <Lock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Your payment info is secure and encrypted
                </span>
              </div>
            </div>
          )}

          {/* Bank Transfer Details */}
          {paymentMethod === "bank" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 midnight:from-cyan-950/30 midnight:to-blue-950/30 purple:from-pink-950/30 purple:to-purple-950/30 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50 midnight:border-cyan-700/30 purple:border-pink-700/30">
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-4">
                  Transfer the exact amount to the account below:
                </p>

                <div className="space-y-3">
                  {[
                    { label: "Bank Name", value: settings.bankAccount.bankName },
                    { label: "Account Number", value: settings.bankAccount.accountNumber },
                    { label: "Account Name", value: settings.bankAccount.accountName },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 midnight:border-cyan-700/20 purple:border-pink-700/20"
                    >
                      <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {item.label}
                        </p>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                          {item.value}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.value, item.label)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 midnight:hover:bg-gray-700 purple:hover:bg-gray-700 transition-colors cursor-pointer"
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

                <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-4 text-center">
                  Use your admission number as payment reference
                </p>
              </div>
            </div>
          )}

          {/* Cash Payment Info */}
          {paymentMethod === "cash" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 midnight:from-emerald-950/30 midnight:to-cyan-950/30 purple:from-emerald-950/30 purple:to-pink-950/30 rounded-xl p-5 border border-emerald-100 dark:border-emerald-800/50 midnight:border-emerald-700/30 purple:border-emerald-700/30 text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-emerald-500/30">
                  <Banknote className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
                  Pay at School Office
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 mb-4">
                  Visit the school bursar&apos;s office during working hours to make your cash payment.
                </p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl text-sm border border-gray-100 dark:border-gray-700 midnight:border-cyan-700/20 purple:border-pink-700/20">
                  <span className="text-gray-500 dark:text-gray-400">Office Hours:</span>
                  <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">8:00 AM - 4:00 PM</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
