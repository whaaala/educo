"use client";

import { Info } from "lucide-react";

interface OtherDetailsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function OtherDetailsSection({
  formData,
  onChange,
}: OtherDetailsSectionProps) {
  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-gray-700 to-gray-900 dark:from-gray-800 dark:to-gray-950 midnight:from-gray-900 midnight:to-black purple:from-gray-900 purple:to-black px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Info className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">
              Other Details & Bank Information
            </h2>
            <p className="text-sm text-white/80">
              Additional information and financial details
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-8">
        {/* Bank Account Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-300 purple:text-pink-300 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 pb-2">
            Bank Account Details (Optional)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Bank Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Bank Name
              </label>
              <select
                value={formData.bankName || ""}
                onChange={(e) => onChange("bankName", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              >
                <option value="">Select Bank</option>
                <option value="Access Bank">Access Bank</option>
                <option value="Zenith Bank">Zenith Bank</option>
                <option value="GTBank">GTBank</option>
                <option value="First Bank">First Bank</option>
                <option value="UBA">UBA</option>
                <option value="Ecobank">Ecobank</option>
                <option value="Fidelity Bank">Fidelity Bank</option>
                <option value="Union Bank">Union Bank</option>
                <option value="Stanbic IBTC">Stanbic IBTC</option>
                <option value="Sterling Bank">Sterling Bank</option>
                <option value="Polaris Bank">Polaris Bank</option>
                <option value="Wema Bank">Wema Bank</option>
                <option value="Unity Bank">Unity Bank</option>
                <option value="Keystone Bank">Keystone Bank</option>
                <option value="FCMB">FCMB</option>
                <option value="Heritage Bank">Heritage Bank</option>
                <option value="Jaiz Bank">Jaiz Bank</option>
                <option value="Providus Bank">Providus Bank</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Account Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Account Name
              </label>
              <input
                type="text"
                value={formData.accountName || ""}
                onChange={(e) => onChange("accountName", e.target.value)}
                placeholder="Enter account holder name"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* Account Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                Account Number
              </label>
              <input
                type="text"
                value={formData.accountNumber || ""}
                onChange={(e) => onChange("accountNumber", e.target.value)}
                placeholder="Enter account number"
                maxLength={10}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>

            {/* IFSC/Sort Code */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                IFSC / Sort Code
              </label>
              <input
                type="text"
                value={formData.ifscCode || ""}
                onChange={(e) => onChange("ifscCode", e.target.value)}
                placeholder="Enter IFSC or Sort Code"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>
          </div>

          <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
            <p className="text-xs text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              <strong>Note:</strong> Bank details may be used for scholarship
              disbursements or refunds.
            </p>
          </div>
        </div>

        {/* National Identification */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-300 purple:text-pink-300 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 pb-2">
            National Identification (Optional)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ID Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                ID Type
              </label>
              <select
                value={formData.idType || ""}
                onChange={(e) => onChange("idType", e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              >
                <option value="">Select ID Type</option>
                <option value="National ID (NIN)">National ID (NIN)</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Passport">Passport</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* ID Number */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                ID Number
              </label>
              <input
                type="text"
                value={formData.idNumber || ""}
                onChange={(e) => onChange("idNumber", e.target.value)}
                placeholder="Enter ID number"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-300 purple:text-pink-300 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 pb-2">
            Additional Information
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Notes / Comments
            </label>
            <textarea
              value={formData.additionalNotes || ""}
              onChange={(e) => onChange("additionalNotes", e.target.value)}
              placeholder="Any other information that would be helpful for the school to know (special talents, interests, behavioral notes, etc.)"
              rows={5}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
            />
          </div>
        </div>

        {/* Emergency Instructions */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-300 purple:text-pink-300 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 pb-2">
            Emergency Instructions
          </h3>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
              Special Instructions for Emergencies
            </label>
            <textarea
              value={formData.emergencyInstructions || ""}
              onChange={(e) =>
                onChange("emergencyInstructions", e.target.value)
              }
              placeholder="Provide any special instructions for the school staff in case of emergencies (e.g., who to contact first, special considerations, etc.)"
              rows={4}
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all resize-none"
            />
          </div>
        </div>

        {/* Consent & Agreement */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-300 purple:text-pink-300 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 pb-2">
            Consent & Agreement
          </h3>

          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-gray-900 purple:hover:bg-gray-900 transition-all">
              <input
                type="checkbox"
                checked={formData.photoConsent || false}
                onChange={(e) => onChange("photoConsent", e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                I give permission for my child&apos;s photo/video to be used in
                school publications, website, and promotional materials.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-gray-900 purple:hover:bg-gray-900 transition-all">
              <input
                type="checkbox"
                checked={formData.dataConsent || false}
                onChange={(e) => onChange("dataConsent", e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                I consent to the school processing and storing my child&apos;s
                personal data in accordance with data protection regulations.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:bg-gray-100 dark:hover:bg-gray-800 midnight:hover:bg-gray-900 purple:hover:bg-gray-900 transition-all">
              <input
                type="checkbox"
                checked={formData.medicalConsent || false}
                onChange={(e) => onChange("medicalConsent", e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 dark:text-blue-500 midnight:text-cyan-500 purple:text-pink-500 rounded border-gray-300 dark:border-gray-600 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 focus:ring-2"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                I authorize the school to provide emergency medical treatment for
                my child if I cannot be reached.
              </span>
            </label>
          </div>
        </div>

        {/* Final Info Box */}
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20 border border-green-200 dark:border-green-800/30 midnight:border-green-800/30 purple:border-green-800/30">
          <p className="text-sm text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300">
            <strong>Review carefully:</strong> Please review all information
            before submitting. Ensure all required fields are completed
            accurately.
          </p>
        </div>
      </div>
    </div>
  );
}
