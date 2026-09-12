"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Building2, Check, ChevronDown } from "lucide-react";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { getAllTenants } from "@/lib/mockTenants";
import { Tenant } from "@/types/school";

export default function TenantSwitcher() {
  const { currentTenant, switchTenant } = useSchoolSettings();
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, showAbove: false });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  useEffect(() => {
    setTenants(getAllTenants());
    setMounted(true);
  }, []);

  // Update dropdown position when opened
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const maxDropdownHeight = viewportHeight * 0.7; // 70vh
      const spaceBelow = viewportHeight - rect.bottom - 8;
      const spaceAbove = rect.top - 8;

      // Decide whether to show dropdown above or below
      const showAbove = spaceBelow < maxDropdownHeight && spaceAbove > spaceBelow;

      setDropdownPosition({
        top: showAbove ? rect.top - 8 : rect.bottom + 8,
        left: rect.left,
        width: rect.width,
        showAbove
      });
    }
  }, [isOpen]);

  const handleSwitchTenant = (tenantId: string) => {
    switchTenant(tenantId);
    setIsOpen(false);

    // Refresh the page to reload all data with new tenant context
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 w-full px-4 py-3 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
      >
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs text-neutral-500 dark:text-neutral-400">Current School</p>
          <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
            {currentTenant?.name || "Educo Demo School"}
          </p>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-neutral-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {mounted && isOpen && createPortal(
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-[9998]"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div
            className="fixed bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-xl z-[9999] max-h-[70vh] overflow-y-auto"
            style={{
              [dropdownPosition.showAbove ? 'bottom' : 'top']: dropdownPosition.showAbove
                ? `${window.innerHeight - dropdownPosition.top}px`
                : `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`
            }}
          >
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase">
                Switch School
              </div>
              {tenants.map((tenant) => (
                <button
                  key={tenant.id}
                  onClick={() => handleSwitchTenant(tenant.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentTenant?.id === tenant.id
                      ? "bg-blue-50 dark:bg-blue-900/30"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-700"
                  }`}
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                      {tenant.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {tenant.shortName} • {tenant.config.institutionType}
                    </p>
                  </div>
                  {currentTenant?.id === tenant.id && (
                    <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  )}
                </button>
              ))}
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-700 p-2">
              <button
                onClick={() => {
                  router.push("/admin/tenants");
                  setIsOpen(false);
                }}
                className="w-full px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg text-left transition-colors"
              >
                Manage Schools →
              </button>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
