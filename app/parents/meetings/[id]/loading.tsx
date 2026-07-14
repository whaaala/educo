import MainLayout from "@/components/layout/MainLayout";

export default function MeetingDetailLoading() {
  return (
    <MainLayout>
      <div className="min-h-screen animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
          <div className="h-4 w-20 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
        </div>

        {/* Back button skeleton */}
        <div className="mb-6">
          <div className="h-5 w-32 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
        </div>

        {/* Header Section */}
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="h-8 w-64 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                <div className="h-6 w-24 bg-violet-100 dark:bg-violet-900/30 rounded-full" />
              </div>
              <div className="h-4 w-48 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-20 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-lg" />
            <div className="h-9 w-20 bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-lg" />
          </div>
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Platform Hero Banner Skeleton */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-700 dark:to-gray-600 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20" />
                  <div className="space-y-2">
                    <div className="h-4 w-16 bg-white/30 rounded" />
                    <div className="h-6 w-32 bg-white/30 rounded" />
                  </div>
                </div>
                <div className="h-10 w-28 bg-white/20 rounded-full" />
              </div>
            </div>

            {/* Meeting Details Card Skeleton */}
            <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
              {/* Date & Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-sm" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-12 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                      <div className="h-5 w-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                    </div>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] shadow-sm" />
                    <div className="space-y-2 flex-1">
                      <div className="h-3 w-12 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                      <div className="h-5 w-24 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Meeting Link Skeleton */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700/40 dark:to-gray-700/20 border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 space-y-2">
                <div className="h-3 w-24 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded" />
                <div className="h-5 w-full bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded" />
              </div>

              {/* Meeting ID and Passcode */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 space-y-2">
                  <div className="h-3 w-20 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded" />
                  <div className="h-5 w-32 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded" />
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]/30 space-y-2">
                  <div className="h-3 w-16 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded" />
                  <div className="h-5 w-24 bg-gray-200 dark:bg-[#2a2d35] midnight:bg-gray-700 purple:bg-gray-700 rounded" />
                </div>
              </div>
            </div>

            {/* Notes Card Skeleton */}
            <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30" />
                <div className="h-5 w-28 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="space-y-2">
                  <div className="h-4 w-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                  <div className="h-4 w-4/5 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                  <div className="h-4 w-3/4 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Sidebar */}
          <div className="space-y-6">
            {/* Host Card Skeleton */}
            <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30" />
                <div className="h-5 w-24 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-32 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                    <div className="h-4 w-20 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                  </div>
                </div>
                <div className="h-10 w-full bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-xl" />
              </div>
            </div>

            {/* Student Card Skeleton */}
            <div className="bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] rounded-2xl border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 overflow-hidden">
              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/30" />
                <div className="h-5 w-32 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-28 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                    <div className="h-4 w-16 bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded" />
                  </div>
                </div>
              </div>
            </div>

            {/* Actions Card Skeleton */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-850 rounded-2xl border border-gray-100 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 p-5 space-y-3">
              <div className="h-12 w-full bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 rounded-xl" />
              <div className="h-10 w-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-xl" />
              <div className="h-10 w-full bg-gray-200 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
