"use client";

interface MedicalHistoryCardProps {
  allergies?: string[];
  medications?: string[];
}

export default function MedicalHistoryCard({
  allergies,
  medications,
}: MedicalHistoryCardProps) {
  const allergiesArray = Array.isArray(allergies) ? allergies : [];
  const medicationsArray = Array.isArray(medications) ? medications : [];

  return (
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-sm border border-gray-200/40 dark:border-gray-800/40 midnight:border-cyan-500/20 purple:border-pink-500/20 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-200 hover:shadow-md hover:border-gray-300/60 dark:hover:border-gray-700/60 midnight:hover:border-cyan-500/30 purple:hover:border-pink-500/30">
      {/* Header */}
      <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
        Medical History
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-3"></div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
        {/* Known Allergies */}
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1.5">
            Known Allergies
          </p>
          {allergiesArray.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {allergiesArray.map((allergy, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 text-gray-700 dark:text-gray-300 midnight:text-cyan-300/80 purple:text-pink-300/80 rounded-md text-xs font-medium"
                >
                  {allergy}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
              -
            </p>
          )}
        </div>

        {/* Medications */}
        <div>
          <p className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1.5">
            Medications
          </p>
          {medicationsArray.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {medicationsArray.map((med, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/50 purple:bg-gray-800/50 text-gray-700 dark:text-gray-300 midnight:text-cyan-300/80 purple:text-pink-300/80 rounded-md text-xs font-medium"
                >
                  {med}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
              -
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

