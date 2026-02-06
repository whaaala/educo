import MainLayout from "@/components/layout/MainLayout";

export default function EventDetailLoading() {
  return (
    <MainLayout>
      <div className="min-h-screen animate-pulse">
        {/* Breadcrumb skeleton */}
        <div className="mb-4 flex items-center gap-2">
          <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
        </div>

        {/* Main content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero image skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="h-72 bg-gray-200 dark:bg-gray-700" />
              <div className="p-4 flex gap-4">
                <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-12 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            </div>

            {/* Description skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Action buttons skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-3">
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
              <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-lg" />
            </div>

            {/* Contact skeleton */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5">
              <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-14 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
                <div className="h-14 w-full bg-gray-200 dark:bg-gray-700 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
