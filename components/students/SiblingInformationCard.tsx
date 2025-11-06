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
    <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-800/50 midnight:border-cyan-500/30 purple:border-pink-500/30 p-5 transition-all duration-300 hover:shadow-xl hover:border-gray-300/70 dark:hover:border-gray-700/70 midnight:hover:border-cyan-500/40 purple:hover:border-pink-500/40">
      {/* Header */}
      <h3 className="text-sm font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4 uppercase tracking-wider">
        Sibling Information
      </h3>

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800/50 midnight:bg-gray-800/30 purple:bg-gray-800/30 mb-3"></div>

      {/* Siblings List */}
      <div className="space-y-2.5">
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
          const siblingClass = sibling?.class || sibling?.classNum || "-";
          const siblingSection = sibling?.section || "-";

          return (
            <div
              key={idx}
              className="flex items-center gap-3 py-2 px-2.5 rounded-lg bg-gray-50/50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100/70 dark:hover:bg-gray-800/50 transition-colors duration-200"
            >
              {/* Profile Picture */}
              <div className="flex-shrink-0">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200/50 dark:border-gray-700/50 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
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
                              <span class="text-base font-bold text-white">${siblingName.charAt(0).toUpperCase()}</span>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500 midnight:from-cyan-500 midnight:to-blue-600 purple:from-pink-500 purple:to-purple-600 flex items-center justify-center">
                      <span className="text-base font-bold text-white">
                        {siblingName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Name and Class */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 truncate">
                  {siblingName}
                </div>
                <div className="text-xs font-medium text-gray-600 dark:text-gray-400 midnight:text-cyan-300/80 purple:text-pink-300/80">
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

