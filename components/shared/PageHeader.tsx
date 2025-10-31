"use client";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isActive?: boolean;
}

interface PageHeaderProps {
  title: string;
  breadcrumbs: BreadcrumbItem[];
  className?: string;
}

export default function PageHeader({
  title,
  breadcrumbs,
  className = "",
}: PageHeaderProps) {
  return (
    <div className={`w-full lg:w-auto lg:flex-shrink-0 ${className}`}>
      <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-1">
        {title}
      </h1>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 flex-wrap">
        {breadcrumbs.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            {item.isActive ? (
              <span className="text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400 font-medium">
                {item.label}
              </span>
            ) : (
              <span className="hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer">
                {item.label}
              </span>
            )}
            {index < breadcrumbs.length - 1 && <span>/</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
