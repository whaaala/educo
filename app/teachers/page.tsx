"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DashboardPage } from "@/components/pages";

/**
 * Teachers page - Redirects to Personnel/Staff page with Academic Staff filter
 *
 * Per PRD Section 7.3, Staff Management is a unified module for all personnel.
 * Teachers are categorized as "Academic Staff" within the Personnel system.
 */
export default function TeachersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Preserve view mode if specified
    const viewMode = searchParams.get("view");
    const redirectUrl = viewMode
      ? `/staff?category=Academic%20Staff&view=${viewMode}`
      : `/staff?category=Academic%20Staff`;

    router.replace(redirectUrl);
  }, [router, searchParams]);

  return (
    <DashboardPage
      title="Teachers"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Teachers", isActive: true },
      ]}
      loadingText="Redirecting to Personnel..."
    />
  );
}
