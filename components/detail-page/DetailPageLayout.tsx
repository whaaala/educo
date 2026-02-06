"use client";

import React from "react";

interface DetailPageLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

export function DetailPageLayout({
  children,
  sidebar,
  className = "",
}: DetailPageLayoutProps) {
  return (
    <div className={`min-h-screen ${className}`}>
      <div className="max-w-7xl mx-auto">
        {sidebar ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">{children}</div>
            <div className="space-y-6">{sidebar}</div>
          </div>
        ) : (
          <div className="space-y-6">{children}</div>
        )}
      </div>
    </div>
  );
}
