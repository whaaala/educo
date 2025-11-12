// Tenant-aware hook for fetching students (Educo v4.0 Multi-Tenant Architecture)

import { useMemo } from "react";
import { useSchoolSettings } from "@/contexts/SchoolSettingsContext";
import { getAllStudents } from "@/lib/mockStudents";
import { Student } from "@/components/students/StudentCard";

/**
 * Hook to get students filtered by current tenant
 *
 * In production, this would fetch from the database using the tenant's schema.
 * For now, it filters mock students by tenantId.
 *
 * @returns Students belonging to the current tenant
 */
export function useStudentsByTenant(): Student[] {
  const { settings } = useSchoolSettings();
  const tenantId = settings.tenantId || "default";

  const tenantStudents = useMemo(() => {
    const allStudents = getAllStudents();

    // Filter students by tenantId
    // If student has no tenantId, assign to default tenant for backwards compatibility
    return allStudents.filter(student =>
      (student.tenantId || "default") === tenantId
    );
  }, [tenantId]);

  return tenantStudents;
}

/**
 * Hook to get students by specific tenant ID
 * Useful for admin interfaces or cross-tenant operations
 *
 * @param specificTenantId - The tenant ID to fetch students for
 * @returns Students belonging to the specified tenant
 */
export function useStudentsBySpecificTenant(specificTenantId: string): Student[] {
  const tenantStudents = useMemo(() => {
    const allStudents = getAllStudents();

    return allStudents.filter(student =>
      (student.tenantId || "default") === specificTenantId
    );
  }, [specificTenantId]);

  return tenantStudents;
}
