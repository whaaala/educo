import MainLayout from "@/components/layout/MainLayout";

export default function Loading() {
  return (
    <MainLayout>
      <div className="animate-pulse space-y-6">
        {/* Page header skeleton */}
        <div className="flex items-center justify-between">
          <div>
            <div className="h-7 w-48 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded-lg" />
            <div className="h-4 w-72 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded mt-2" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-28 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded-lg" />
            <div className="h-10 w-28 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded-lg" />
          </div>
        </div>

        {/* Stats row skeleton */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1729] purple:bg-[#1f0d33] rounded-xl border border-gray-100 dark:border-gray-700 midnight:border-gray-800 purple:border-purple-800/30 p-5">
              <div className="h-4 w-20 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded mb-3" />
              <div className="h-8 w-16 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded" />
            </div>
          ))}
        </div>

        {/* Table skeleton */}
        <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0f1729] purple:bg-[#1f0d33] rounded-xl border border-gray-100 dark:border-gray-700 midnight:border-gray-800 purple:border-purple-800/30">
          {/* Table header */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 midnight:border-gray-800 purple:border-purple-800/30 flex items-center gap-4">
            <div className="h-10 w-64 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded-lg" />
            <div className="h-10 w-32 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded-lg" />
          </div>
          {/* Table rows */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 border-b border-gray-50 dark:border-gray-700/50 midnight:border-gray-800/50 purple:border-purple-800/20 flex items-center gap-4">
              <div className="h-10 w-10 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-40 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded" />
                <div className="h-3 w-24 bg-gray-100 dark:bg-[#22262e]/50 midnight:bg-[#0f1330]/50 purple:bg-purple-900/30 rounded" />
              </div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded-full" />
              <div className="h-8 w-8 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-purple-900/40 rounded" />
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
