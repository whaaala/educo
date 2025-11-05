"use client";

interface BankDetailsCardProps {
  bankName?: string;
  branch?: string;
  ifscNumber?: string;
}

export default function BankDetailsCard({
  bankName,
  branch,
  ifscNumber,
}: BankDetailsCardProps) {
  const hasAnyData = bankName || branch || ifscNumber;

  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
        Bank Details
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-3"></div>

      {/* Content */}
      {hasAnyData ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* Bank Name */}
          {bankName && (
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1.5">
                Bank Name
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                {bankName}
              </p>
            </div>
          )}

          {/* Branch */}
          {branch && (
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1.5">
                Branch
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                {branch}
              </p>
            </div>
          )}

          {/* IFSC */}
          {ifscNumber && (
            <div>
              <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1.5">
                IFSC
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                {ifscNumber}
              </p>
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 py-2">
          No bank details available
        </p>
      )}
    </div>
  );
}

