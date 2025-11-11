// Mock Tenant Configurations for Demo Purposes

import { TenantTranscriptConfig } from "@/types/tenant";

export const mockTenantConfigs: Record<string, TenantTranscriptConfig> = {
  // Default Educo School Configuration
  "educo-default": {
    tenantId: "educo-default",
    branding: {
      schoolName: "EDUCO SCHOOL SYSTEM",
      schoolNameShort: "EDUCO",
      schoolLogo: "", // Temporarily removed - logo file doesn't exist
      schoolMotto: "Excellence in Education",
      address: "123 Education Avenue",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "100001",
      phone: "+234 800 EDUCO-01",
      email: "registrar@educo.africa",
      website: "www.educo.africa",
    },
    design: {
      template: "classic",
      primaryColor: "#2563eb", // Blue
      secondaryColor: "#1e40af",
      accentColor: "#3b82f6",
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
    verificationUrl: "verify.educo.africa",
  },

  // Modern International School
  "greenfield-international": {
    tenantId: "greenfield-international",
    branding: {
      schoolName: "GREENFIELD INTERNATIONAL SCHOOL",
      schoolNameShort: "GIS",
      schoolLogo: "/logos/greenfield-logo.png",
      schoolMotto: "Building Global Leaders",
      address: "45 Victoria Island Road",
      city: "Lagos",
      state: "Lagos",
      country: "Nigeria",
      postalCode: "101241",
      phone: "+234 809 123 4567",
      email: "academics@greenfield.edu.ng",
      website: "www.greenfield.edu.ng",
    },
    design: {
      template: "modern",
      primaryColor: "#059669", // Green
      secondaryColor: "#047857",
      accentColor: "#10b981",
      headerStyle: "logo-left",
      showSchoolLogo: true,
      showSchoolMotto: true,
      showWatermark: true,
      watermarkText: "VERIFIED",
      fontFamily: "system-ui",
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
    verificationUrl: "transcripts.greenfield.edu.ng/verify",
  },

  // Traditional Formal School
  "royaloak-academy": {
    tenantId: "royaloak-academy",
    branding: {
      schoolName: "ROYAL OAK ACADEMY",
      schoolNameShort: "ROA",
      schoolLogo: "/logos/royaloak-logo.png",
      schoolMotto: "Wisdom, Character, Excellence",
      address: "78 Independence Avenue",
      city: "Abuja",
      state: "FCT",
      country: "Nigeria",
      postalCode: "900211",
      phone: "+234 802 345 6789",
      email: "admin@royaloak.edu.ng",
      website: "www.royaloak.edu.ng",
    },
    design: {
      template: "formal",
      primaryColor: "#7c2d12", // Brown
      secondaryColor: "#92400e",
      accentColor: "#a16207",
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
    verificationUrl: "royaloak.edu.ng/verify",
  },

  // Minimalist Tech School
  "techbridge-college": {
    tenantId: "techbridge-college",
    branding: {
      schoolName: "TECHBRIDGE COLLEGE",
      schoolNameShort: "TBC",
      schoolLogo: "/logos/techbridge-logo.png",
      schoolMotto: "Innovation Through Education",
      address: "12 Tech Hub Drive",
      city: "Port Harcourt",
      state: "Rivers",
      country: "Nigeria",
      postalCode: "500211",
      phone: "+234 803 456 7890",
      email: "records@techbridge.edu.ng",
      website: "www.techbridge.edu.ng",
    },
    design: {
      template: "minimal",
      primaryColor: "#6366f1", // Indigo
      secondaryColor: "#4f46e5",
      accentColor: "#818cf8",
      headerStyle: "logo-right",
      showSchoolLogo: true,
      showSchoolMotto: false,
      showWatermark: false,
      fontFamily: "sans-serif",
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
    verificationUrl: "verify.techbridge.edu.ng",
  },
};

// Function to get tenant config (in real app, this would fetch from database)
export function getTenantConfig(tenantId?: string): TenantTranscriptConfig {
  const id = tenantId || "educo-default";
  return mockTenantConfigs[id] || mockTenantConfigs["educo-default"];
}

// Function to get current tenant ID (in real app, this would come from auth/session)
export function getCurrentTenantId(): string {
  // For demo purposes, return default tenant
  // In production, this would be from user session or subdomain
  return "educo-default";
}
