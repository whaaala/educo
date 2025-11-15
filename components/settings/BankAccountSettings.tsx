"use client";

import { useState, useEffect } from "react";
import { Building2, CheckCircle2, Info } from "lucide-react";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import FormInput from "@/components/shared/FormInput";

export default function BankAccountSettings() {
  const { settings, updateSettings } = useSchoolSettings();
  const [bankName, setBankName] = useState(settings.bankAccount.bankName);
  const [accountNumber, setAccountNumber] = useState(settings.bankAccount.accountNumber);
  const [accountName, setAccountName] = useState(settings.bankAccount.accountName);
  const [currency, setCurrency] = useState(settings.currency);
  const [saved, setSaved] = useState(false);

  // Sync with context when it changes
  useEffect(() => {
    setBankName(settings.bankAccount.bankName);
    setAccountNumber(settings.bankAccount.accountNumber);
    setAccountName(settings.bankAccount.accountName);
    setCurrency(settings.currency);
  }, [settings]);

  const handleSave = () => {
    // Update context
    updateSettings({
      currency,
      bankAccount: {
        bankName,
        accountNumber,
        accountName,
      },
    });

    // Save to localStorage
    localStorage.setItem("schoolCurrency", currency);
    localStorage.setItem(
      "schoolBankAccount",
      JSON.stringify({
        bankName,
        accountNumber,
        accountName,
      })
    );

    // Show success message
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);

    // Trigger event for other components to refresh
    window.dispatchEvent(new Event("bankAccountChanged"));
  };

  const hasChanges =
    bankName !== settings.bankAccount.bankName ||
    accountNumber !== settings.bankAccount.accountNumber ||
    accountName !== settings.bankAccount.accountName ||
    currency !== settings.currency;

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border border-blue-200 dark:border-blue-800 midnight:border-cyan-700 purple:border-pink-700 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-300 purple:text-pink-300">
              Bank Account Configuration
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 mt-1">
              These bank account details will be used throughout the application for payment collection (transcript requests, fee payments, etc.).
              Changes will apply immediately after saving.
            </p>
          </div>
        </div>
      </div>

      {/* Currency Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
          Currency
        </label>
        <input
          type="text"
          value={currency}
          onChange={(e) => setCurrency(e.target.value.toUpperCase())}
          placeholder="NGN"
          maxLength={3}
          className="w-full h-[46px] px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 text-sm font-normal placeholder:text-gray-400 dark:placeholder:text-gray-500 midnight:placeholder:text-cyan-400/50 purple:placeholder:text-pink-400/50 focus:ring-1 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 midnight:focus:ring-cyan-500/10 purple:focus:ring-pink-500/10 focus:border-blue-400 dark:focus:border-blue-500 midnight:focus:border-cyan-500 purple:focus:border-pink-500 outline-none transition-all duration-200 hover:border-gray-400 dark:hover:border-gray-500"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
          3-letter ISO currency code (e.g., NGN, USD, GHS, KES)
        </p>
      </div>

      {/* Bank Account Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          Bank Account Details
        </h3>

        <FormInput
          label="Bank Name"
          value={bankName}
          onChange={(value) => setBankName(value)}
          placeholder="e.g., First Bank, Access Bank, GTBank"
          icon={<Building2 className="w-2.5 h-2.5" />}
          required
        />

        <FormInput
          label="Account Number"
          value={accountNumber}
          onChange={(value) => setAccountNumber(value)}
          placeholder="e.g., 1234567890"
          icon={<Building2 className="w-2.5 h-2.5" />}
          required
        />

        <FormInput
          label="Account Name"
          value={accountName}
          onChange={(value) => setAccountName(value)}
          placeholder="e.g., School Account, Educo School Ltd"
          icon={<Building2 className="w-2.5 h-2.5" />}
          required
        />
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm text-white transition-all duration-200 flex items-center gap-2 ${
            hasChanges
              ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 dark:from-blue-500 dark:to-blue-600 dark:hover:from-blue-600 dark:hover:to-blue-700 midnight:from-cyan-600 midnight:to-cyan-700 midnight:hover:from-cyan-700 midnight:hover:to-cyan-800 purple:from-pink-600 purple:to-pink-700 purple:hover:from-pink-700 purple:hover:to-pink-800 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
              : "bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50"
          }`}
        >
          Save Changes
        </button>

        {saved && (
          <div className="flex items-center gap-2 text-green-600 dark:text-green-400 midnight:text-green-400 purple:text-green-400 animate-in fade-in duration-200">
            <CheckCircle2 className="w-5 h-5" />
            <span className="text-sm font-medium">Settings saved successfully!</span>
          </div>
        )}
      </div>

      {/* Preview Section */}
      <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-3">
          Preview (as shown to users)
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Bank Name:</span>
            <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {bankName || "Not set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Account Number:</span>
            <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {accountNumber || "Not set"}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Account Name:</span>
            <span className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              {accountName || "Not set"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
