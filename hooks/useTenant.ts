// Hook for managing tenant operations
// Educo v4.0 Multi-Tenant System

import { useMemo } from "react";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { getTenantById, getAllTenants } from "@/lib/mockTenants";
import { Tenant } from "@/types/school";

/**
 * Hook to get the current tenant based on SchoolSettingsContext
 */
export function useCurrentTenant(): Tenant | undefined {
  const { settings } = useSchoolSettings();
  const tenantId = settings.tenantId || "educo-default";

  return useMemo(() => {
    return getTenantById(tenantId);
  }, [tenantId]);
}

/**
 * Hook to get all tenants
 */
export function useAllTenants(): Tenant[] {
  return useMemo(() => {
    return getAllTenants();
  }, []);
}

/**
 * Hook to get a specific tenant by ID
 */
export function useTenant(tenantId?: string): Tenant | undefined {
  return useMemo(() => {
    if (!tenantId) return undefined;
    return getTenantById(tenantId);
  }, [tenantId]);
}

/**
 * Hook to get tenant configuration values
 */
export function useTenantConfig() {
  const tenant = useCurrentTenant();

  return useMemo(() => {
    if (!tenant) {
      return {
        currency: "NGN",
        region: "Nigeria",
        timezone: "Africa/Lagos",
        locale: "en-NG",
        institutionType: "Private" as const,
        supportedLevels: ["Secondary" as const],
        defaultEducationLevel: "Secondary" as const,
      };
    }

    return {
      currency: tenant.config.currency,
      region: tenant.config.region,
      timezone: tenant.config.timezone,
      locale: tenant.config.locale,
      institutionType: tenant.config.institutionType,
      supportedLevels: tenant.config.supportedLevels,
      defaultEducationLevel: tenant.config.defaultEducationLevel,
      termSystem: tenant.config.termSystem,
      academicYearStart: tenant.config.academicYearStart,
      academicYearEnd: tenant.config.academicYearEnd,
      enabledFeatures: tenant.config.enabledFeatures,
      bankAccount: tenant.config.bankAccount,
    };
  }, [tenant]);
}

/**
 * Hook to get tenant branding values
 */
export function useTenantBranding() {
  const tenant = useCurrentTenant();

  return useMemo(() => {
    if (!tenant) {
      return {
        primaryColor: "#2563eb",
        secondaryColor: "#1e40af",
        motto: "Excellence in Education",
        theme: "auto" as const,
      };
    }

    return {
      primaryColor: tenant.branding.primaryColor,
      secondaryColor: tenant.branding.secondaryColor,
      accentColor: tenant.branding.accentColor,
      motto: tenant.branding.motto,
      mission: tenant.branding.mission,
      vision: tenant.branding.vision,
      theme: tenant.branding.theme,
      logoUrl: tenant.branding.logoUrl,
      transcriptDesign: tenant.branding.transcriptDesign,
      signatures: tenant.branding.signatures,
    };
  }, [tenant]);
}

/**
 * Hook to check if a feature is enabled for the current tenant
 */
export function useFeatureFlag(featureFlag: string): boolean {
  const tenant = useCurrentTenant();

  return useMemo(() => {
    if (!tenant) return false;
    return tenant.config.enabledFeatures.includes(featureFlag);
  }, [tenant, featureFlag]);
}

/**
 * Hook to get tenant contact information
 */
export function useTenantContact() {
  const tenant = useCurrentTenant();

  return useMemo(() => {
    if (!tenant) {
      return {
        email: "",
        phone: "",
        website: "",
        address: {
          line1: "",
          city: "",
          state: "",
          country: "Nigeria",
        },
      };
    }

    return tenant.contact;
  }, [tenant]);
}

/**
 * Hook to get tenant subscription information
 */
export function useTenantSubscription() {
  const tenant = useCurrentTenant();

  return useMemo(() => {
    if (!tenant || !tenant.subscription) {
      return null;
    }

    return tenant.subscription;
  }, [tenant]);
}

/**
 * Hook to check if current tenant supports a specific education level
 */
export function useSupportsEducationLevel(level: "Primary" | "Secondary" | "Tertiary"): boolean {
  const tenant = useCurrentTenant();

  return useMemo(() => {
    if (!tenant) return false;
    return tenant.config.supportedLevels.includes(level);
  }, [tenant, level]);
}
