"use client";

interface Sibling {
  name?: string;
  photo?: string | File | null;
  class?: string;
  section?: string;
}

interface SiblingInformationCardProps {
  siblings?: Sibling[];
}

export default function SiblingInformationCard({
  siblings,
}: SiblingInformationCardProps) {
  const siblingsArray = Array.isArray(siblings) ? siblings : [];
  
  // Don't render if no siblings
  if (siblingsArray.length === 0) {
    return null;
  }

  return (
    <div className="group bg-gradient-to-br from-white to-gray-50/30 dark:from-gray-800 dark:to-gray-800/50 midnight:from-gray-800 midnight:to-gray-900/50 purple:from-gray-800 purple:to-gray-900/50 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200/60 dark:border-gray-700/60 midnight:border-cyan-500/30 purple:border-pink-500/30 p-2.5 sm:p-5 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/20 midnight:hover:shadow-cyan-500/20 purple:hover:shadow-pink-500/20 hover:border-blue-300/60 dark:hover:border-blue-600/60 midnight:hover:border-cyan-400/60 purple:hover:border-pink-400/60 hover:-translate-y-0.5">
      {/* Header */}
      <h3 className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2 sm:mb-4 uppercase tracking-wider">
        Sibling Information
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-[#1a1d24]/50 midnight:bg-[#0f1330]/30 purple:bg-[#251340]/30 mb-2 sm:mb-3"></div>

      {/* Siblings List */}
      <div className="space-y-1.5 sm:space-y-2.5">
        {siblingsArray.map((sibling, idx) => {
          // Check multiple possible field names for photo
          const siblingPhotoUrl = typeof sibling?.photo === "string"
            ? sibling.photo
            : typeof (sibling as any)?.avatar === "string"
            ? (sibling as any).avatar
            : null;

          // Debug: Log for first sibling only
          if (idx === 0) {
            console.log("Sibling data:", sibling);
            console.log("Sibling photo URL:", siblingPhotoUrl);
            console.log("Photo field type:", typeof sibling?.photo);
          }

          const siblingName = sibling?.name || "Unknown";
          const siblingClass = sibling?.class || (sibling as any)?.classNum || "-";
          const siblingSection = sibling?.section || "-";

          return (
            <div
              key={idx}
              className="flex items-center gap-2 sm:gap-3 py-1.5 sm:py-2 px-2 sm:px-2.5 rounded-xl bg-gradient-to-br from-gray-50/80 to-gray-100/50 dark:from-gray-800/40 dark:to-gray-800/20 midnight:from-gray-900/40 midnight:to-gray-900/20 purple:from-gray-900/40 purple:to-gray-900/20 border border-gray-200/30 dark:border-gray-700/30 midnight:border-cyan-500/10 purple:border-pink-500/10 hover:from-gray-100 hover:to-gray-100/70 dark:hover:from-gray-800/60 dark:hover:to-gray-800/40 hover:border-gray-300/50 dark:hover:border-gray-600/50 shadow-sm hover:shadow-md transition-all duration-300"
            >
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="relative w-9 h-9 sm:w-12 sm:h-12 rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
                  {siblingPhotoUrl ? (
                    <img
                      src={siblingPhotoUrl}
                      alt={siblingName}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Sibling image failed to load:", siblingPhotoUrl, "for sibling:", siblingName);
                        const target = e.target as HTMLImageElement;
                        if (target.parentElement) {
                          target.parentElement.innerHTML = `
                            <div class="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center">
                              <span class="text-sm sm:text-base font-bold text-white">${siblingName.charAt(0).toUpperCase()}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center">
                      <span className="text-sm sm:text-base font-bold text-white">
                        {siblingName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Class */}
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                  {siblingName}
                </div>
                <div className="text-[10px] sm:text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
                  {siblingClass}, {siblingSection}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

