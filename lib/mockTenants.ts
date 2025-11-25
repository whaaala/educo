// Mock Tenant Data (Educo v4.0 Multi-Tenant System)

import { Tenant, TenantSummary } from "@/types/school";

/**
 * Mock Tenants - Represents different schools using the Educo system
 * In production, this would be fetched from the database
 */
export const mockTenants: Tenant[] = [
  {
    id: "educo-default",
    name: "Educo Demo School",
    shortName: "EDUCO",
    slug: "educo-demo",
    subdomain: "demo.educo.africa",
    status: "Active",
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",

    config: {
      supportedLevels: ["Secondary", "Tertiary"],
      defaultEducationLevel: "Secondary",
      institutionType: "Private",
      tertiaryType: "University",
      scheduleType: "full-time",
      supportsMultipleLevels: true,
      academicYearStart: "September",
      academicYearEnd: "July",
      termSystem: "3-term",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [
        "FF_Student_Profile",
        "FF_Student_Transfer",
        "FF_Finance_Private",
        "FF_Grading_Primary",
        "FF_Grading_Secondary",
      ],
      bankAccount: {
        bankName: "First Bank Nigeria",
        accountNumber: "1234567890",
        accountName: "Educo Demo School",
      },
    },

    contact: {
      email: "admin@educo.africa",
      phone: "+234 800 EDUCO-01",
      website: "www.educo.africa",
      address: {
        line1: "123 Education Avenue",
        city: "Lagos",
        state: "Lagos",
        postalCode: "100001",
        country: "Nigeria",
      },
    },

    branding: {
      motto: "Excellence in Education",
      primaryColor: "#2563eb",
      secondaryColor: "#1e40af",
      theme: "auto",
      transcriptDesign: {
        template: "classic",
        headerStyle: "centered",
        showSchoolLogo: true,
        showSchoolMotto: true,
        showWatermark: true,
        watermarkText: "OFFICIAL",
        fontFamily: "system-ui",
        borderStyle: "solid",
        includeQRCode: true,
      },
      signatures: {
        registrarName: "Dr. Oluwaseun Adebayo",
        registrarTitle: "Registrar",
        principalName: "Prof. Chioma Okonkwo",
        principalTitle: "Principal",
        showOfficialSeal: true,
      },
    },

    subscription: {
      plan: "professional",
      status: "active",
      startDate: "2024-01-15",
      maxStudents: 1000,
      maxStaff: 100,
      features: ["all"],
    },
  },

  {
    id: "greenfield-international",
    name: "Greenfield International School",
    shortName: "GIS",
    slug: "greenfield",
    subdomain: "greenfield.educo.africa",
    status: "Active",
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",

    config: {
      supportedLevels: ["Primary", "Secondary"],
      defaultEducationLevel: "Secondary",
      institutionType: "International",
      scheduleType: "full-time",
      supportsMultipleLevels: true,
      academicYearStart: "September",
      academicYearEnd: "June",
      termSystem: "3-term",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [
        "FF_Student_Profile",
        "FF_Student_Transfer",
        "FF_Finance_Private",
        "FF_Hostel_Management",
        "FF_Transport_GPS",
      ],
      bankAccount: {
        bankName: "Access Bank Nigeria",
        accountNumber: "0987654321",
        accountName: "Greenfield International School",
      },
    },

    contact: {
      email: "academics@greenfield.edu.ng",
      phone: "+234 809 123 4567",
      website: "www.greenfield.edu.ng",
      address: {
        line1: "45 Victoria Island Road",
        city: "Lagos",
        state: "Lagos",
        postalCode: "101241",
        country: "Nigeria",
      },
    },

    branding: {
      motto: "Building Global Leaders",
      mission: "To provide world-class education",
      primaryColor: "#059669",
      secondaryColor: "#047857",
      theme: "light",
      transcriptDesign: {
        template: "modern",
        headerStyle: "logo-left",
        showSchoolLogo: true,
        showSchoolMotto: true,
        showWatermark: true,
        watermarkText: "VERIFIED",
        borderStyle: "double",
        includeQRCode: true,
      },
      signatures: {
        registrarName: "Mrs. Funmilayo Adeleke",
        registrarTitle: "Academic Registrar",
        principalName: "Dr. Emmanuel Okafor",
        principalTitle: "School Principal",
        showOfficialSeal: true,
      },
    },

    subscription: {
      plan: "enterprise",
      status: "active",
      startDate: "2024-02-01",
      maxStudents: 2000,
      maxStaff: 200,
      features: ["all"],
    },
  },

  {
    id: "royaloak-academy",
    name: "Royal Oak Academy",
    shortName: "ROA",
    slug: "royaloak",
    subdomain: "royaloak.educo.africa",
    status: "Active",
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",

    config: {
      supportedLevels: ["Primary", "Secondary"],
      defaultEducationLevel: "Secondary",
      institutionType: "Private",
      scheduleType: "full-time",
      supportsMultipleLevels: true,
      academicYearStart: "September",
      academicYearEnd: "July",
      termSystem: "3-term",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [
        "FF_Student_Profile",
        "FF_Finance_Private",
        "FF_Grading_Primary",
        "FF_Grading_Secondary",
      ],
      bankAccount: {
        bankName: "GTBank Nigeria",
        accountNumber: "1122334455",
        accountName: "Royal Oak Academy",
      },
    },

    contact: {
      email: "admin@royaloak.edu.ng",
      phone: "+234 802 345 6789",
      website: "www.royaloak.edu.ng",
      address: {
        line1: "78 Independence Avenue",
        city: "Abuja",
        state: "FCT",
        postalCode: "900211",
        country: "Nigeria",
      },
    },

    branding: {
      motto: "Wisdom, Character, Excellence",
      primaryColor: "#7c2d12",
      secondaryColor: "#92400e",
      theme: "light",
      transcriptDesign: {
        template: "formal",
        headerStyle: "centered",
        showSchoolLogo: true,
        showSchoolMotto: true,
        showWatermark: true,
        watermarkText: "AUTHENTIC",
        fontFamily: "serif",
        borderStyle: "double",
        includeQRCode: false,
      },
      signatures: {
        registrarName: "Mr. Chukwuemeka Nwosu",
        registrarTitle: "Chief Registrar",
        principalName: "Rev. Dr. Grace Adeyemi",
        principalTitle: "Head of School",
        showOfficialSeal: true,
      },
    },

    subscription: {
      plan: "professional",
      status: "active",
      startDate: "2024-03-10",
      maxStudents: 800,
      maxStaff: 80,
      features: ["all"],
    },
  },

  {
    id: "techbridge-college",
    name: "TechBridge College",
    shortName: "TBC",
    slug: "techbridge",
    subdomain: "techbridge.educo.africa",
    status: "Active",
    createdAt: "2024-06-01T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",

    config: {
      supportedLevels: ["Tertiary"],
      defaultEducationLevel: "Tertiary",
      institutionType: "Private",
      tertiaryType: "College of Technology",
      scheduleType: "full-time",
      supportsMultipleLevels: false,
      academicYearStart: "September",
      academicYearEnd: "July",
      termSystem: "2-semester",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [
        "FF_Student_Profile",
        "FF_Finance_Tertiary",
        "FF_Grading_Tertiary",
        "FF_Hostel_Management",
        "FF_LMS_Zoom",
      ],
      bankAccount: {
        bankName: "Zenith Bank Nigeria",
        accountNumber: "5566778899",
        accountName: "TechBridge College",
      },
    },

    contact: {
      email: "records@techbridge.edu.ng",
      phone: "+234 803 456 7890",
      website: "www.techbridge.edu.ng",
      address: {
        line1: "12 Tech Hub Drive",
        city: "Port Harcourt",
        state: "Rivers",
        postalCode: "500211",
        country: "Nigeria",
      },
    },

    branding: {
      motto: "Innovation Through Education",
      mission: "Empowering the next generation of tech leaders",
      primaryColor: "#6366f1",
      secondaryColor: "#4f46e5",
      theme: "dark",
      transcriptDesign: {
        template: "minimal",
        headerStyle: "logo-right",
        showSchoolLogo: true,
        showSchoolMotto: false,
        showWatermark: false,
        borderStyle: "none",
        includeQRCode: true,
      },
      signatures: {
        registrarName: "Dr. Aisha Mohammed",
        registrarTitle: "Academic Coordinator",
        principalName: "Prof. Taiwo Johnson",
        principalTitle: "College Provost",
        showOfficialSeal: true,
      },
    },

    subscription: {
      plan: "professional",
      status: "active",
      startDate: "2024-06-01",
      maxStudents: 500,
      maxStaff: 50,
      features: ["all"],
    },
  },
];

/**
 * Get all tenants
 */
export function getAllTenants(): Tenant[] {
  return mockTenants;
}

/**
 * Get tenant by ID
 */
export function getTenantById(id: string): Tenant | undefined {
  return mockTenants.find((tenant) => tenant.id === id);
}

/**
 * Get tenant by slug
 */
export function getTenantBySlug(slug: string): Tenant | undefined {
  return mockTenants.find((tenant) => tenant.slug === slug);
}

/**
 * Get tenant summaries (for listing pages)
 */
export function getTenantSummaries(): TenantSummary[] {
  return mockTenants.map((tenant) => ({
    id: tenant.id,
    name: tenant.name,
    shortName: tenant.shortName,
    slug: tenant.slug,
    status: tenant.status,
    institutionType: tenant.config.institutionType,
    region: tenant.config.region,
    createdAt: tenant.createdAt,
    subscription: tenant.subscription ? {
      plan: tenant.subscription.plan,
      status: tenant.subscription.status,
    } : undefined,
  }));
}

/**
 * Create a new tenant (mock implementation)
 */
export function createTenant(data: Partial<Tenant>): Tenant {
  const newTenant: Tenant = {
    id: data.id || `tenant-${Date.now()}`,
    name: data.name || "New School",
    slug: data.slug || "new-school",
    status: "Active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: data.config || {
      supportedLevels: ["Secondary"],
      defaultEducationLevel: "Secondary",
      institutionType: "Private",
      scheduleType: "full-time",
      supportsMultipleLevels: false,
      academicYearStart: "September",
      academicYearEnd: "July",
      termSystem: "3-term",
      region: "Nigeria",
      timezone: "Africa/Lagos",
      locale: "en-NG",
      currency: "NGN",
      enabledFeatures: [],
    },
    contact: data.contact || {
      email: "admin@school.com",
      phone: "+234 800 0000 000",
      address: {
        line1: "",
        city: "",
        state: "",
        country: "Nigeria",
      },
    },
    branding: data.branding || {
      primaryColor: "#2563eb",
    },
  };

  mockTenants.push(newTenant);
  return newTenant;
}

/**
 * Update tenant
 */
export function updateTenant(id: string, data: Partial<Tenant>): Tenant | undefined {
  const index = mockTenants.findIndex((t) => t.id === id);
  if (index === -1) return undefined;

  mockTenants[index] = {
    ...mockTenants[index],
    ...data,
    updatedAt: new Date().toISOString(),
  };

  return mockTenants[index];
}

/**
 * Delete tenant
 */
export function deleteTenant(id: string): boolean {
  const index = mockTenants.findIndex((t) => t.id === id);
  if (index === -1) return false;

  mockTenants.splice(index, 1);
  return true;
}
