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
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-ink mb-1">
        Bank Details
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 mb-3"></div>

      {/* Content */}
      {hasAnyData ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
          {/* Bank Name */}
          {bankName && (
            <div>
              <p className="text-xs sm:text-sm font-semibold text-ink mb-1.5">
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
              <p className="text-xs sm:text-sm font-semibold text-ink mb-1.5">
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
              <p className="text-xs sm:text-sm font-semibold text-ink mb-1.5">
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

