import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      <div className="w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome to Educo
        </h1>
        <p className="text-gray-600 mb-8">
          School ERP & Digital Management System
        </p>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Component Testing: Sidebar Navigation
          </h2>
          <div className="space-y-3 text-gray-600">
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Collapsible sidebar - Click the menu icon in the sidebar header to collapse/expand</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Mobile responsive - On mobile screens, use the hamburger menu in the top-left</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Expandable menu items - Click on menu items with arrows to expand sub-menus</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Hover effects - Menu items highlight on hover</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span>Smooth animations - All transitions are smooth and professional</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-green-600 font-semibold">✓</span>
              <span className="font-semibold text-blue-600">NEW:</span>
              <span>Content area now smoothly adjusts width when sidebar collapses/expands</span>
            </p>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              Testing Instructions:
            </h3>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Test the sidebar collapse/expand functionality on desktop</li>
              <li>Watch how the content area smoothly expands to fill the space</li>
              <li>Resize your browser to mobile size and test the mobile menu</li>
              <li>Click on menu items with children (Peoples, Academic, Management, Settings)</li>
              <li>Verify hover states and transitions</li>
              <li>Test navigation by clicking on individual menu items</li>
            </ol>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
