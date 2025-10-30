"use client";

import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="w-full">
        <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 mb-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
            Component Testing: Header & User Menu
          </h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span className="font-semibold text-blue-600">NEW:</span>
              <span>Header with search bar, notifications bell, and user menu</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span className="font-semibold text-blue-600">NEW:</span>
              <span>User menu dropdown with profile, settings, and logout options</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span className="font-semibold text-blue-600">NEW:</span>
              <span>Avatar with initials fallback (no image required)</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span className="font-semibold text-blue-600">NEW:</span>
              <span>Click outside to close dropdown functionality</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span className="font-semibold text-blue-600">NEW:</span>
              <span>Responsive design - User info hidden on mobile, shown in dropdown</span>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10 border border-blue-200 dark:border-blue-700 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg transition-colors duration-300">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
              Header Testing Instructions:
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-400 midnight:text-cyan-300 purple:text-pink-300 space-y-2 list-decimal list-inside">
              <li>Click the user menu in the top-right corner to open dropdown</li>
              <li>Test all menu items: My Profile, Settings, Logout</li>
              <li>Click outside the dropdown to close it</li>
              <li>Resize to mobile view - user info should hide on button, show in dropdown</li>
              <li>Check notification bell has red dot indicator</li>
              <li>Search bar should be visible on desktop, hidden on mobile</li>
            </ol>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1a1d23] midnight:bg-[#0f1729] purple:bg-[#2a1a3e] rounded-lg shadow-sm border border-gray-200 dark:border-gray-800/50 midnight:border-cyan-500/20 purple:border-pink-500/20 p-6 transition-colors duration-300">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
            Component Testing: Sidebar Navigation
          </h2>
          <div className="space-y-3 text-gray-600 dark:text-gray-300 midnight:text-cyan-100 purple:text-pink-100">
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Collapsible sidebar - Click the collapse icon in the sidebar header</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Mobile responsive - Use hamburger menu on mobile screens</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Expandable menu items - Click items with arrows to expand sub-menus</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Hover popovers - When collapsed, hover over items to see sub-menus</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Content area responsively adjusts to sidebar state</span>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 midnight:bg-cyan-500/10 purple:bg-pink-500/10 border border-blue-200 dark:border-blue-700 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg transition-colors duration-300">
            <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300 midnight:text-cyan-200 purple:text-pink-200 mb-2">
              Sidebar Testing Instructions:
            </h3>
            <ol className="text-sm text-blue-800 dark:text-blue-400 midnight:text-cyan-300 purple:text-pink-300 space-y-2 list-decimal list-inside">
              <li>Test sidebar collapse/expand on desktop</li>
              <li>Watch content area adjust width smoothly</li>
              <li>Test mobile menu on small screens</li>
              <li>Hover over collapsed menu items to see popovers</li>
              <li>Test quick switching between menu items</li>
            </ol>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
