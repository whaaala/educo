/**
 * Feature Guard Component for Student Management
 *
 * This component conditionally renders children based on feature flags
 * aligned with the Educo v4.0 PRD multi-tenant architecture
 */

"use client";

import { ReactNode } from "react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";
import type { FeatureFlagKey } from "@/lib/featureFlags";

interface StudentFeatureGuardProps {
  children: ReactNode;
  feature: FeatureFlagKey;
  fallback?: ReactNode;
  showMessage?: boolean;
}

/**
 * Conditionally renders children if the specified feature flag is enabled
 *
 * @example
 * <StudentFeatureGuard feature="FF_Student_Transfer">
 *   <TransferStudentButton />
 * </StudentFeatureGuard>
 */
export default function StudentFeatureGuard({
  children,
  feature,
  fallback = null,
  showMessage = false,
}: StudentFeatureGuardProps) {
  const { isEnabled, tenantContext } = useFeatureFlags();

  if (!isEnabled(feature)) {
    if (showMessage) {
      return (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30">
          <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400">
            This feature is not available for your institution type ({tenantContext.institutionType})
            and education level ({tenantContext.educationLevel}).
          </p>
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Batch feature guard that checks multiple features (OR logic)
 */
interface StudentFeatureGuardAnyProps {
  children: ReactNode;
  features: FeatureFlagKey[];
  fallback?: ReactNode;
}

export function StudentFeatureGuardAny({
  children,
  features,
  fallback = null,
}: StudentFeatureGuardAnyProps) {
  const { isEnabled } = useFeatureFlags();

  const hasAnyFeature = features.some(feature => isEnabled(feature));

  if (!hasAnyFeature) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

/**
 * Batch feature guard that checks multiple features (AND logic)
 */
interface StudentFeatureGuardAllProps {
  children: ReactNode;
  features: FeatureFlagKey[];
  fallback?: ReactNode;
}

export function StudentFeatureGuardAll({
  children,
  features,
  fallback = null,
}: StudentFeatureGuardAllProps) {
  const { isEnabled } = useFeatureFlags();

  const hasAllFeatures = features.every(feature => isEnabled(feature));

  if (!hasAllFeatures) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
