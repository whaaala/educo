"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  DollarSign,
  CreditCard,
  CheckCircle2,
  XCircle,
  Info
} from "lucide-react";
import {
  SchoolType,
  PAYMENT_CHANNELS,
  FEE_CATEGORIES,
  getFeeCategoriesForSchoolType,
  getPaymentChannelsForSchoolType
} from "@/lib/feeConfigNew";
import CustomDropdown from "@/components/shared/CustomDropdown";

// School type configuration
const SCHOOL_TYPE_OPTIONS = [
  { label: "Private School", value: "private" },
  { label: "Public School", value: "public" },
  { label: "Tertiary Institution", value: "tertiary" },
];

export default function FeeSettings() {
  const [schoolType, setSchoolType] = useState<SchoolType>("private");
  const [enabledPaymentChannels, setEnabledPaymentChannels] = useState<string[]>([]);
  const [enabledFeeCategories, setEnabledFeeCategories] = useState<string[]>([]);

  // Load settings from localStorage
  useEffect(() => {
    const savedSchoolType = localStorage.getItem("schoolType") as SchoolType | null;
    const savedPaymentChannels = localStorage.getItem("enabledPaymentChannels");
    const savedFeeCategories = localStorage.getItem("enabledFeeCategories");

    if (savedSchoolType) setSchoolType(savedSchoolType);
    if (savedPaymentChannels) setEnabledPaymentChannels(JSON.parse(savedPaymentChannels));
    if (savedFeeCategories) setEnabledFeeCategories(JSON.parse(savedFeeCategories));
  }, []);

  // Save school type to localStorage
  const handleSchoolTypeChange = (value: string | number) => {
    const newSchoolType = value as SchoolType;
    setSchoolType(newSchoolType);
    localStorage.setItem("schoolType", newSchoolType);

    // Reset enabled channels and categories when school type changes
    const applicableChannels = getPaymentChannelsForSchoolType(newSchoolType).map(c => c.id);
    const applicableCategories = getFeeCategoriesForSchoolType(newSchoolType).map(c => c.id);

    setEnabledPaymentChannels(applicableChannels);
    setEnabledFeeCategories(applicableCategories);

    localStorage.setItem("enabledPaymentChannels", JSON.stringify(applicableChannels));
    localStorage.setItem("enabledFeeCategories", JSON.stringify(applicableCategories));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("schoolTypeChanged", {
      detail: { schoolType: newSchoolType }
    }));
  };

  // Toggle payment channel
  const togglePaymentChannel = (channelId: string) => {
    const newChannels = enabledPaymentChannels.includes(channelId)
      ? enabledPaymentChannels.filter(id => id !== channelId)
      : [...enabledPaymentChannels, channelId];

    setEnabledPaymentChannels(newChannels);
    localStorage.setItem("enabledPaymentChannels", JSON.stringify(newChannels));
  };

  // Toggle fee category
  const toggleFeeCategory = (categoryId: string) => {
    const newCategories = enabledFeeCategories.includes(categoryId)
      ? enabledFeeCategories.filter(id => id !== categoryId)
      : [...enabledFeeCategories, categoryId];

    setEnabledFeeCategories(newCategories);
    localStorage.setItem("enabledFeeCategories", JSON.stringify(newCategories));
  };

  const applicablePaymentChannels = getPaymentChannelsForSchoolType(schoolType);
  const applicableFeeCategories = getFeeCategoriesForSchoolType(schoolType);

  return (
    <div className="space-y-6">
      {/* School Type Selection */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-3 block">
          School Type
        </label>
        <CustomDropdown
          value={schoolType}
          options={SCHOOL_TYPE_OPTIONS}
          onChange={handleSchoolTypeChange}
          variant="blue"
          className="w-full max-w-xs"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-2">
          Select your institution type to configure appropriate fee categories and payment channels
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 midnight:bg-blue-900/20 purple:bg-blue-900/20 border border-blue-200 dark:border-blue-700 midnight:border-blue-700 purple:border-blue-700 rounded-lg">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-blue-300 purple:text-blue-300">
              Fee Configuration
            </p>
            <p className="text-xs text-blue-800 dark:text-blue-400 midnight:text-blue-400 purple:text-blue-400 mt-1">
              The selected school type determines available fee categories and payment channels.
              Enable or disable specific options below to customize your fee management system.
            </p>
          </div>
        </div>
      </div>

      {/* Payment Channels */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <CreditCard className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Payment Channels
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {applicablePaymentChannels.map((channel) => {
            const isEnabled = enabledPaymentChannels.includes(channel.id);
            return (
              <button
                key={channel.id}
                onClick={() => togglePaymentChannel(channel.id)}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isEnabled
                    ? "bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-600"
                    : "bg-gray-50 dark:bg-[#1a1d24]/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isEnabled
                      ? "bg-green-100 dark:bg-green-900/30"
                      : "bg-gray-100 dark:bg-[#22262e]"
                  }`}>
                    <CreditCard className={`w-5 h-5 ${
                      isEnabled
                        ? "text-green-600 dark:text-green-400"
                        : "text-gray-400"
                    }`} />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-semibold ${
                      isEnabled
                        ? "text-green-900 dark:text-green-100"
                        : "text-gray-700 dark:text-gray-300"
                    }`}>
                      {channel.name}
                    </p>
                    {channel.provider && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Provider: {channel.provider}
                      </p>
                    )}
                  </div>
                </div>
                {isEnabled ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fee Categories */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Fee Categories
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {applicableFeeCategories.map((category) => {
            const isEnabled = enabledFeeCategories.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => toggleFeeCategory(category.id)}
                className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  isEnabled
                    ? "bg-green-50 dark:bg-green-950/20 border-green-500 dark:border-green-600"
                    : "bg-gray-50 dark:bg-[#1a1d24]/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                }`}
              >
                <div className="text-left flex-1">
                  <p className={`text-sm font-semibold ${
                    isEnabled
                      ? "text-green-900 dark:text-green-100"
                      : "text-gray-700 dark:text-gray-300"
                  }`}>
                    {category.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {category.description}
                  </p>
                </div>
                {isEnabled ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 ml-2" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0 ml-2" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
