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
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 pt-2 px-3 sm:px-4 pb-4 sm:pb-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
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
                  className="px-2.5 py-1 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-900/20 midnight:from-red-900/40 midnight:to-red-900/20 purple:from-red-900/40 purple:to-red-900/20 text-red-700 dark:text-red-300 midnight:text-red-300 purple:text-red-300 rounded-lg text-xs font-medium shadow-sm hover:shadow-md hover:from-red-200 hover:to-red-300 dark:hover:from-red-900/60 dark:hover:to-red-900/40 transition-all duration-300 border border-red-200/50 dark:border-red-800/30 midnight:border-red-800/30 purple:border-red-800/30"
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
                  className="px-2.5 py-1 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-900/20 midnight:from-green-900/40 midnight:to-green-900/20 purple:from-green-900/40 purple:to-green-900/20 text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300 rounded-lg text-xs font-medium shadow-sm hover:shadow-md hover:from-green-200 hover:to-green-300 dark:hover:from-green-900/60 dark:hover:to-green-900/40 transition-all duration-300 border border-green-200/50 dark:border-green-800/30 midnight:border-green-800/30 purple:border-green-800/30"
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

