/**
 * Test Helpers & Utilities
 *
 * Shared test utilities including context providers wrapper,
 * mock data factories, and viewport simulation helpers.
 */

import React, { type ReactElement, type ReactNode } from "react";
import { render, type RenderOptions } from "@testing-library/react";

// ============ Mock Context Providers ============

const MockSchoolSettingsProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

const MockThemeProvider = ({ children }: { children: ReactNode }) => {
  return <>{children}</>;
};

/**
 * Wraps children with all required context providers for testing.
 * Use this with the custom render function below.
 */
function AllProviders({ children }: { children: ReactNode }) {
  return (
    <MockThemeProvider>
      <MockSchoolSettingsProvider>{children}</MockSchoolSettingsProvider>
    </MockThemeProvider>
  );
}

/**
 * Custom render that wraps components in all required providers.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper">
) {
  return render(ui, { wrapper: AllProviders, ...options });
}

// Re-export everything from testing-library
export { render } from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

// ============ Mock Data Factories ============

export function makeParentChild(overrides: Record<string, unknown> = {}) {
  return {
    id: "child-1",
    studentId: "STU-001",
    firstName: "Janet",
    lastName: "Daniel",
    fullName: "Janet Daniel",
    admissionNumber: "AD9892434",
    classLevel: "JSS 1",
    section: "A",
    dateOfBirth: "2011-05-15",
    gender: "Female" as const,
    status: "Active" as const,
    relationship: "Father" as const,
    ...overrides,
  };
}

export function makeParentProfile(overrides: Record<string, unknown> = {}) {
  return {
    id: "parent-001",
    firstName: "Emeka",
    lastName: "Okonkwo",
    email: "emeka@email.com",
    phone: "+234 803 456 7890",
    occupation: "Engineer",
    address: {
      line1: "15 Victoria Island",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
    },
    relationship: "Father" as const,
    isPrimaryContact: true,
    children: [makeParentChild()],
    createdAt: "2024-01-05T10:30:00Z",
    updatedAt: "2024-12-15T14:22:00Z",
    ...overrides,
  };
}

export function makeAdminParent(overrides: Record<string, unknown> = {}) {
  return {
    ...makeParentProfile(),
    totalOutstandingFees: 75000,
    totalPaidFees: 250000,
    lastPaymentDate: "2024-12-10",
    lastLoginDate: "2024-12-20",
    communicationPreference: "email" as const,
    status: "Active" as const,
    ...overrides,
  };
}

export function makeFeeRecord(overrides: Record<string, unknown> = {}) {
  return {
    id: "fee-001",
    childId: "child-1",
    childName: "Janet Daniel",
    feeType: "School Fees",
    term: "1st Term",
    academicYear: "2024/2025",
    amount: 150000,
    paidAmount: 100000,
    balance: 50000,
    dueDate: "2024-10-15",
    status: "partial" as const,
    paymentHistory: [],
    ...overrides,
  };
}

export function makePayment(overrides: Record<string, unknown> = {}) {
  return {
    id: "pay-001",
    date: "2024-12-10",
    amount: 50000,
    method: "Card" as const,
    reference: "REF-123456",
    receiptNumber: "RCP-2024-00001",
    ...overrides,
  };
}

export function makeMessage(overrides: Record<string, unknown> = {}) {
  return {
    id: "msg-001",
    senderId: "teacher-001",
    senderName: "Mr. Adeyemi",
    senderRole: "Teacher" as const,
    subject: "Math Progress Update",
    content: "Your child is doing well in Mathematics.",
    timestamp: "2024-12-20T10:00:00Z",
    isRead: false,
    ...overrides,
  };
}

export function makeEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: "evt-001",
    title: "Parent-Teacher Meeting",
    description: "Quarterly progress review",
    date: "2025-01-15",
    startTime: "10:00",
    endTime: "11:00",
    location: "Room 101",
    type: "meeting" as const,
    ...overrides,
  };
}

// ============ Viewport Helpers ============

export const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  tabletLandscape: { width: 1024, height: 768 },
  desktop: { width: 1440, height: 900 },
} as const;

/**
 * Sets up matchMedia mock to simulate a specific viewport width.
 */
export function setViewport(width: number) {
  Object.defineProperty(window, "innerWidth", {
    writable: true,
    configurable: true,
    value: width,
  });

  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => {
      // Parse min-width and max-width from media queries
      const minMatch = query.match(/min-width:\s*(\d+)px/);
      const maxMatch = query.match(/max-width:\s*(\d+)px/);
      const minWidth = minMatch ? parseInt(minMatch[1]) : 0;
      const maxWidth = maxMatch ? parseInt(maxMatch[1]) : Infinity;

      return {
        matches: width >= minWidth && width <= maxWidth,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      };
    },
  });

  window.dispatchEvent(new Event("resize"));
}
