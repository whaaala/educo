"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { isFeatureEnabled, getEnabledFeatures, type FeatureFlagKey } from "@/lib/featureFlags";
import { BankAccountSettings } from "@/types/tenant";
import { getTenantById } from "@/lib/mockTenants";
import { Tenant } from "@/types/school";

export type EducationLevel = "Primary" | "Secondary" | "Tertiary";
export type InstitutionType = "Public" | "Private" | "International";

export type SchoolScheduleType = "full-time" | "after-school" | "weekend" | "online" | "hybrid";

interface SchoolSettings {
  // School-wide settings
  supportedLevels: EducationLevel[]; // Array of supported education levels
  defaultEducationLevel: EducationLevel; // Default/fallback level
  institutionType: InstitutionType;
  schoolName: string;
  schoolType: string;
  tertiaryType?: string; // University, College, Polytechnic, etc.
  scheduleType: SchoolScheduleType; // Full-time, after-school, weekend, online, hybrid

  // Multi-level support
  supportsMultipleLevels: boolean; // If true, education level can be detected from class

  // Multi-tenant & feature flags (Educo v4.0)
  tenantId?: string; // Schema-per-tenant identifier
  region?: string; // For regional feature rollout (Nigeria, Ghana, Kenya, etc.)
  subdomain?: string; // Tenant subdomain (e.g., sunrise.educo.africa)

  // Financial settings
  currency: string; // School's default currency (e.g., NGN, USD, GHS)
  bankAccount: BankAccountSettings; // Bank account details for payments
}

interface SchoolSettingsContextType {
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  // Feature flag helpers
  isFeatureEnabled: (flag: FeatureFlagKey) => boolean;
  getEnabledFeatures: () => FeatureFlagKey[];
  // Tenant helpers (Educo v4.0)
  currentTenant: Tenant | undefined;
  switchTenant: (tenantId: string) => void;
}

const defaultSettings: SchoolSettings = {
  supportedLevels: ["Primary", "Secondary"], // Default to multi-level
  defaultEducationLevel: "Secondary", // Default fallback
  institutionType: "Private",
  schoolName: "Educo School",
  schoolType: "Day School",
  tertiaryType: undefined,
  scheduleType: "full-time", // Default to full-time day school
  supportsMultipleLevels: true, // Allow class-based detection
  // Multi-tenant fields
  tenantId: "default",
  region: "Nigeria", // Default region
  subdomain: "demo.educo.africa",
  // Financial settings
  currency: "NGN",
  bankAccount: {
    bankName: "First Bank",
    accountNumber: "1234567890",
    accountName: "School Account",
  },
};

const SchoolSettingsContext = createContext<SchoolSettingsContextType | undefined>(
  undefined
);

// Helper function to map localStorage education level values to context values
function mapEducationLevel(level: string): { educationLevel: EducationLevel; supportsMultipleLevels: boolean } {
  switch (level) {
    case "primary":
      return { educationLevel: "Primary", supportsMultipleLevels: false };
    case "secondary":
      return { educationLevel: "Secondary", supportsMultipleLevels: false };
    case "tertiary":
      return { educationLevel: "Tertiary", supportsMultipleLevels: false };
    case "multi-level":
      return { educationLevel: "Secondary", supportsMultipleLevels: true }; // Default to Secondary for multi-level
    default:
      return { educationLevel: "Secondary", supportsMultipleLevels: true };
  }
}

// Helper function to map localStorage institution type to context values
function mapInstitutionType(type: string): InstitutionType {
  switch (type) {
    case "public":
      return "Public";
    case "private":
      return "Private";
    default:
      return "Private";
  }
}

export function SchoolSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);
  const [currentTenant, setCurrentTenant] = useState<Tenant | undefined>(undefined);

  // Load tenant data and sync with settings
  useEffect(() => {
    const tenantId = settings.tenantId || "educo-default";
    const tenant = getTenantById(tenantId);
    setCurrentTenant(tenant);

    // Sync tenant config to settings if tenant exists
    if (tenant) {
      setSettings((prev) => ({
        ...prev,
        tenantId: tenant.id,
        schoolName: tenant.name,
        supportedLevels: tenant.config.supportedLevels,
        defaultEducationLevel: tenant.config.defaultEducationLevel,
        institutionType: tenant.config.institutionType,
        tertiaryType: tenant.config.tertiaryType,
        scheduleType: tenant.config.scheduleType,
        supportsMultipleLevels: tenant.config.supportsMultipleLevels,
        region: tenant.config.region,
        subdomain: tenant.subdomain,
        currency: tenant.config.currency,
        bankAccount: tenant.config.bankAccount || prev.bankAccount,
      }));
    }
  }, [settings.tenantId]);

  // Load settings from localStorage on mount and listen for changes
  useEffect(() => {
    const loadSettings = () => {
      const savedTenantId = localStorage.getItem("currentTenantId");
      const savedLevels = localStorage.getItem("educationLevels");
      const savedInstitutionType = localStorage.getItem("institutionType");
      const savedTertiaryType = localStorage.getItem("tertiaryType");
      const savedScheduleType = localStorage.getItem("scheduleType");
      const savedCurrency = localStorage.getItem("schoolCurrency");
      const savedBankAccount = localStorage.getItem("schoolBankAccount");

      let supportedLevels: EducationLevel[] = defaultSettings.supportedLevels;
      let supportsMultipleLevels = defaultSettings.supportsMultipleLevels;

      // Try to load new multi-select format
      if (savedLevels) {
        try {
          const levels = JSON.parse(savedLevels) as EducationLevel[];
          supportedLevels = levels;
          supportsMultipleLevels = levels.length > 1;
        } catch (e) {
          // Fallback to old single-value format
          const oldValue = localStorage.getItem("educationLevel");
          if (oldValue) {
            const { educationLevel, supportsMultipleLevels: multiLevel } = mapEducationLevel(oldValue);
            supportedLevels = multiLevel ? ["Primary", "Secondary"] : [educationLevel];
            supportsMultipleLevels = multiLevel;
          }
        }
      } else {
        // Check for old format
        const oldValue = localStorage.getItem("educationLevel");
        if (oldValue) {
          const { educationLevel, supportsMultipleLevels: multiLevel } = mapEducationLevel(oldValue);
          supportedLevels = multiLevel ? ["Primary", "Secondary"] : [educationLevel];
          supportsMultipleLevels = multiLevel;
        }
      }

      const institutionType = savedInstitutionType
        ? mapInstitutionType(savedInstitutionType)
        : defaultSettings.institutionType;

      const tertiaryType = savedTertiaryType || undefined;

      const scheduleType = (savedScheduleType as SchoolScheduleType) || defaultSettings.scheduleType;

      // Determine default education level (first in the list or fallback)
      const defaultEducationLevel = supportedLevels[0] || defaultSettings.defaultEducationLevel;

      // Load bank account settings
      const currency = savedCurrency || defaultSettings.currency;
      let bankAccount = defaultSettings.bankAccount;
      if (savedBankAccount) {
        try {
          bankAccount = JSON.parse(savedBankAccount);
        } catch (e) {
          // Use default if parsing fails
        }
      }

      // Use saved tenant ID or default
      const tenantId = savedTenantId || defaultSettings.tenantId;

      setSettings((prev) => ({
        ...prev,
        tenantId,
        supportedLevels,
        defaultEducationLevel,
        institutionType,
        tertiaryType,
        scheduleType,
        supportsMultipleLevels,
        currency,
        bankAccount,
      }));
    };

    // Load on mount
    loadSettings();

    // Listen for changes from SchoolProfileSettings and BankAccountSettings components
    const handleSchoolProfileChange = () => {
      loadSettings();
    };

    const handleBankAccountChange = () => {
      loadSettings();
    };

    window.addEventListener("schoolProfileChanged", handleSchoolProfileChange);
    window.addEventListener("bankAccountChanged", handleBankAccountChange);

    return () => {
      window.removeEventListener("schoolProfileChanged", handleSchoolProfileChange);
      window.removeEventListener("bankAccountChanged", handleBankAccountChange);
    };
  }, []);

  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Switch to a different tenant (Educo v4.0)
  const switchTenant = (tenantId: string) => {
    localStorage.setItem("currentTenantId", tenantId);
    setSettings((prev) => ({ ...prev, tenantId }));

    // Dispatch custom event to notify other components
    window.dispatchEvent(new CustomEvent("tenantChanged", { detail: { tenantId } }));
  };

  // Feature flag helpers that use current school context
  const checkFeatureEnabled = (flag: FeatureFlagKey): boolean => {
    return isFeatureEnabled(flag, {
      educationLevel: settings.defaultEducationLevel,
      institutionType: settings.institutionType,
      region: settings.region,
    });
  };

  const getContextEnabledFeatures = (): FeatureFlagKey[] => {
    return getEnabledFeatures({
      educationLevel: settings.defaultEducationLevel,
      institutionType: settings.institutionType,
      region: settings.region,
    });
  };

  return (
    <SchoolSettingsContext.Provider
      value={{
        settings,
        updateSettings,
        isFeatureEnabled: checkFeatureEnabled,
        getEnabledFeatures: getContextEnabledFeatures,
        currentTenant,
        switchTenant,
      }}
    >
      {children}
    </SchoolSettingsContext.Provider>
  );
}

export function useSchoolSettings() {
  const context = useContext(SchoolSettingsContext);
  if (context === undefined) {
    throw new Error("useSchoolSettings must be used within a SchoolSettingsProvider");
  }
  return context;
}
