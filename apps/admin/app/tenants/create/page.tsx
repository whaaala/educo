"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Building2, Globe, Mail, Palette, Languages, Cloud } from "lucide-react";
import AdminPageShell from "@admin/components/pages/AdminPageShell";
import Button from "@/components/shared/Button";
import { createTenant } from "@/lib/mockTenants";
import { Tenant, InstitutionType, EducationLevel, type TranslationProvider, type StorageProviderType } from "@/types/school";
import { ColorPickerPopover, colorToSolid } from "@/components/shared/ColorPalettePicker";

interface CreateTenantForm {
  // Basic Information
  name: string;
  shortName: string;
  slug: string;
  subdomain: string;

  // Configuration
  institutionType: InstitutionType;
  supportedLevels: EducationLevel[];
  defaultEducationLevel: EducationLevel;
  academicYearStart: string;
  academicYearEnd: string;
  termSystem: "2-term" | "3-term" | "2-semester" | "4-quarter";
  region: string;
  timezone: string;
  currency: string;

  // Contact Information
  email: string;
  phone: string;
  website: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;

  // Branding
  motto: string;
  primaryColor: string;
  secondaryColor: string;

  // Bank Account
  bankName: string;
  accountNumber: string;
  accountName: string;

  // Translation
  translationEnabled: boolean;
  translationAllowDeepL: boolean;
  translationAllowGoogleCloud: boolean;
  translationAllowGoogle: boolean;
  translationDefaultProvider: TranslationProvider;

  // Cloud Storage
  storageEnabled: boolean;
  storageProvider: StorageProviderType;
  storageConfigMode: "platform" | "tenant";
}

export default function CreateTenantPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateTenantForm>({
    // Basic Information
    name: "",
    shortName: "",
    slug: "",
    subdomain: "",

    // Configuration
    institutionType: "Private",
    supportedLevels: ["Secondary"],
    defaultEducationLevel: "Secondary",
    academicYearStart: "September",
    academicYearEnd: "July",
    termSystem: "3-term",
    region: "Nigeria",
    timezone: "Africa/Lagos",
    currency: "NGN",

    // Contact Information
    email: "",
    phone: "",
    website: "",
    addressLine1: "",
    city: "",
    state: "",
    postalCode: "",
    country: "Nigeria",

    // Branding
    motto: "",
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",

    // Bank Account
    bankName: "",
    accountNumber: "",
    accountName: "",

    // Translation
    translationEnabled: false,
    translationAllowDeepL: true,
    translationAllowGoogleCloud: false,
    translationAllowGoogle: true,
    translationDefaultProvider: "deepl",

    // Cloud Storage
    storageEnabled: true,
    storageProvider: "supabase",
    storageConfigMode: "platform",
  });

  const handleInputChange = <K extends keyof CreateTenantForm>(field: K, value: CreateTenantForm[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleEducationLevelToggle = (level: EducationLevel) => {
    setFormData((prev) => {
      const levels = prev.supportedLevels.includes(level)
        ? prev.supportedLevels.filter((l) => l !== level)
        : [...prev.supportedLevels, level];

      // If default level is removed, set to first available level
      let defaultLevel = prev.defaultEducationLevel;
      if (!levels.includes(defaultLevel)) {
        defaultLevel = levels[0] || "Secondary";
      }

      return {
        ...prev,
        supportedLevels: levels,
        defaultEducationLevel: defaultLevel,
      };
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (name: string) => {
    handleInputChange("name", name);
    if (!formData.slug) {
      const slug = generateSlug(name);
      setFormData((prev) => ({
        ...prev,
        name,
        slug,
        subdomain: `${slug}.educo.africa`,
      }));
    } else {
      handleInputChange("name", name);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!formData.name.trim()) newErrors.name = "School name is required";
    if (!formData.slug.trim()) newErrors.slug = "Slug is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    if (formData.supportedLevels.length === 0) {
      newErrors.supportedLevels = "At least one education level is required";
    }

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Create tenant data structure
      const tenantData: Partial<Tenant> = {
        name: formData.name,
        shortName: formData.shortName || formData.name.split(" ").map(w => w[0]).join(""),
        slug: formData.slug,
        subdomain: formData.subdomain,
        status: "Active",
        config: {
          supportedLevels: formData.supportedLevels,
          defaultEducationLevel: formData.defaultEducationLevel,
          institutionType: formData.institutionType,
          scheduleType: "full-time",
          supportsMultipleLevels: formData.supportedLevels.length > 1,
          academicYearStart: formData.academicYearStart,
          academicYearEnd: formData.academicYearEnd,
          termSystem: formData.termSystem,
          region: formData.region,
          timezone: formData.timezone,
          locale: "en-NG",
          currency: formData.currency,
          enabledFeatures: ["FF_Student_Profile"],
          bankAccount: formData.bankName ? {
            bankName: formData.bankName,
            accountNumber: formData.accountNumber,
            accountName: formData.accountName,
          } : undefined,
          translation: {
            enabled: formData.translationEnabled,
            allowedProviders: (() => {
              const allowed = ([
                formData.translationAllowDeepL ? "deepl" : null,
                formData.translationAllowGoogleCloud ? "google-cloud" : null,
                formData.translationAllowGoogle ? "google" : null,
              ].filter(Boolean) as TranslationProvider[]);
              return allowed.length ? allowed : (["google"] as TranslationProvider[]);
            })(),
            defaultProvider: (() => {
              const allowed = ([
                formData.translationAllowDeepL ? "deepl" : null,
                formData.translationAllowGoogleCloud ? "google-cloud" : null,
                formData.translationAllowGoogle ? "google" : null,
              ].filter(Boolean) as TranslationProvider[]);
              const safeAllowed = allowed.length ? allowed : (["google"] as TranslationProvider[]);

              const requested = formData.translationDefaultProvider;
              if (requested === "google") {
                return safeAllowed.includes("deepl")
                  ? "deepl"
                  : safeAllowed.includes("google-cloud")
                    ? "google-cloud"
                    : "google";
              }
              return safeAllowed.includes(requested)
                ? requested
                : safeAllowed.includes("deepl")
                  ? "deepl"
                  : safeAllowed.includes("google-cloud")
                    ? "google-cloud"
                    : safeAllowed[0];
            })(),
          },
          storage: {
            enabled: formData.storageEnabled,
            provider: formData.storageProvider,
            configMode: formData.storageConfigMode,
          },
        },
        contact: {
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          address: {
            line1: formData.addressLine1,
            city: formData.city,
            state: formData.state,
            postalCode: formData.postalCode,
            country: formData.country,
          },
        },
        branding: {
          motto: formData.motto,
          primaryColor: formData.primaryColor,
          secondaryColor: formData.secondaryColor,
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
            registrarName: "",
            registrarTitle: "Registrar",
            principalName: "",
            principalTitle: "Principal",
            showOfficialSeal: true,
          },
        },
        subscription: {
          plan: "professional",
          status: "trial",
          startDate: new Date().toISOString().split("T")[0],
          maxStudents: 500,
          maxStaff: 50,
          features: ["all"],
        },
      };

      // Create the tenant
      const newTenant = createTenant(tenantData);

      // Redirect to tenant details page
      router.push(`/tenants/${newTenant.id}`);
    } catch (error) {
      console.error("Error creating tenant:", error);
      setErrors({ submit: "Failed to create school. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminPageShell
      title="Add New School"
      breadcrumbs={[
        { label: "Dashboard", href: "/" },
        { label: "Tenants", href: "/tenants" },
        { label: "Create", isActive: true },
      ]}
    >
      <form onSubmit={handleSubmit} className="space-y-6 pb-20">
          {/* Basic Information */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Basic Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 ${
                    errors.name
                      ? "border-red-500"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}
                  placeholder="e.g., Greenfield International School"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Short Name
                </label>
                <input
                  type="text"
                  value={formData.shortName}
                  onChange={(e) => handleInputChange("shortName", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., GIS"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => handleInputChange("slug", generateSlug(e.target.value))}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 ${
                    errors.slug
                      ? "border-red-500"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}
                  placeholder="e.g., greenfield"
                />
                {errors.slug && (
                  <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Subdomain
                </label>
                <input
                  type="text"
                  value={formData.subdomain}
                  onChange={(e) => handleInputChange("subdomain", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., greenfield.educo.africa"
                />
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Globe className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Configuration
              </h2>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Institution Type
                </label>
                <select
                  value={formData.institutionType}
                  onChange={(e) =>
                    handleInputChange("institutionType", e.target.value as InstitutionType)
                  }
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                >
                  <option value="Public">Public</option>
                  <option value="Private">Private</option>
                  <option value="International">International</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                  Supported Education Levels <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {(["Primary", "Secondary", "Tertiary"] as EducationLevel[]).map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-2 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    >
                      <input
                        type="checkbox"
                        checked={formData.supportedLevels.includes(level)}
                        onChange={() => handleEducationLevelToggle(level)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm text-neutral-900 dark:text-neutral-100">
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.supportedLevels && (
                  <p className="mt-1 text-sm text-red-500">{errors.supportedLevels}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Default Education Level
                  </label>
                  <select
                    value={formData.defaultEducationLevel}
                    onChange={(e) =>
                      handleInputChange("defaultEducationLevel", e.target.value as EducationLevel)
                    }
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  >
                    {formData.supportedLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Term System
                  </label>
                  <select
                    value={formData.termSystem}
                    onChange={(e) =>
                      handleInputChange("termSystem", e.target.value as CreateTenantForm["termSystem"])
                    }
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="2-term">2 Terms</option>
                    <option value="3-term">3 Terms</option>
                    <option value="2-semester">2 Semesters</option>
                    <option value="4-quarter">4 Quarters</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Academic Year Start
                  </label>
                  <input
                    type="text"
                    value={formData.academicYearStart}
                    onChange={(e) => handleInputChange("academicYearStart", e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="e.g., September"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Academic Year End
                  </label>
                  <input
                    type="text"
                    value={formData.academicYearEnd}
                    onChange={(e) => handleInputChange("academicYearEnd", e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="e.g., July"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Region
                  </label>
                  <input
                    type="text"
                    value={formData.region}
                    onChange={(e) => handleInputChange("region", e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="e.g., Nigeria"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Currency
                  </label>
                  <input
                    type="text"
                    value={formData.currency}
                    onChange={(e) => handleInputChange("currency", e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                    placeholder="e.g., NGN"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Translation Settings */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-sky-100 dark:bg-sky-900/30 rounded-lg">
                <Languages className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Translation Settings
              </h2>
            </div>

            <div className="space-y-5">
              <label className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                <input
                  type="checkbox"
                  checked={formData.translationEnabled}
                  onChange={(e) => handleInputChange("translationEnabled", e.target.checked)}
                  className="w-5 h-5 text-sky-600 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Enable document translation
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Controls whether apps in this tenant can translate documents.
                  </p>
                </div>
              </label>

              <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${formData.translationEnabled ? "" : "opacity-50 pointer-events-none"}`}>
                <label className="flex items-start gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <input
                    type="checkbox"
                    checked={formData.translationAllowDeepL}
                    onChange={(e) => handleInputChange("translationAllowDeepL", e.target.checked)}
                    className="w-5 h-5 text-sky-600 rounded mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">DeepL</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Requires server `DEEPL_AUTH_KEY` (free tier limits apply).
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <input
                    type="checkbox"
                    checked={formData.translationAllowGoogleCloud}
                    onChange={(e) => handleInputChange("translationAllowGoogleCloud", e.target.checked)}
                    className="w-5 h-5 text-sky-600 rounded mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Google Cloud</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Paid Google translation (requires `GOOGLE_CLOUD_TRANSLATE_API_KEY`).
                    </p>
                  </div>
                </label>

                <label className="flex items-start gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                  <input
                    type="checkbox"
                    checked={formData.translationAllowGoogle}
                    onChange={(e) => handleInputChange("translationAllowGoogle", e.target.checked)}
                    className="w-5 h-5 text-sky-600 rounded mt-0.5"
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">Google</p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Unofficial endpoint (fallback only).
                    </p>
                  </div>
                </label>
              </div>

              <div className={`${formData.translationEnabled ? "" : "opacity-50 pointer-events-none"}`}>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Primary engine
                </label>
                <select
                  value={formData.translationDefaultProvider}
                  onChange={(e) => {
                    const v = e.target.value as TranslationProvider;
                    setFormData((prev) => ({
                      ...prev,
                      translationDefaultProvider: v,
                      translationAllowDeepL: v === "deepl" ? true : prev.translationAllowDeepL,
                      translationAllowGoogleCloud: v === "google-cloud" ? true : prev.translationAllowGoogleCloud,
                    }));
                  }}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                >
                  <option value="deepl">DeepL Free</option>
                  <option value="google-cloud">Google Cloud (paid)</option>
                </select>
                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Unofficial Google is always fallback-only.
                </p>
              </div>
            </div>
          </div>

          {/* Cloud Storage Settings */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                <Cloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                  Cloud Storage
                </h2>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Configure cloud storage for document saving and sharing between users.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <label className="flex items-center gap-3 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-700/50">
                <input
                  type="checkbox"
                  checked={formData.storageEnabled}
                  onChange={(e) => handleInputChange("storageEnabled", e.target.checked)}
                  className="w-5 h-5 text-indigo-600 rounded"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                    Enable cloud storage
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Users can save and share files via cloud storage. Each user connects their own account.
                  </p>
                </div>
              </label>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${formData.storageEnabled ? "" : "opacity-50 pointer-events-none"}`}>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Storage Provider
                  </label>
                  <select
                    value={formData.storageProvider}
                    onChange={(e) => handleInputChange("storageProvider", e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="supabase">Platform Storage (Recommended)</option>
                    <option value="dropbox">Dropbox</option>
                    <option value="google-drive">Google Drive</option>
                    <option value="onedrive">OneDrive</option>
                  </select>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Platform Storage (Supabase) is recommended. Dropbox is available as overflow.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Credentials Mode
                  </label>
                  <select
                    value={formData.storageConfigMode}
                    onChange={(e) => handleInputChange("storageConfigMode", e.target.value)}
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  >
                    <option value="platform">Platform (shared credentials)</option>
                    <option value="tenant">Tenant (school provides own app)</option>
                  </select>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    {formData.storageConfigMode === "platform"
                      ? "Uses the platform's cloud storage app — no setup needed."
                      : "School must create their own app and provide credentials."
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Mail className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Contact Information
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 ${
                    errors.email
                      ? "border-red-500"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}
                  placeholder="admin@school.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 ${
                    errors.phone
                      ? "border-red-500"
                      : "border-neutral-300 dark:border-neutral-600"
                  }`}
                  placeholder="+234 800 000 0000"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Website
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="www.school.com"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.addressLine1}
                  onChange={(e) => handleInputChange("addressLine1", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="Street address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., Lagos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  State/Province
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., Lagos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postalCode}
                  onChange={(e) => handleInputChange("postalCode", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., 100001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange("country", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., Nigeria"
                />
              </div>
            </div>
          </div>

          {/* Branding */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg">
                <Palette className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Branding (Optional)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  School Motto
                </label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => handleInputChange("motto", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., Excellence in Education"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Primary Color
                </label>
                <ColorPickerPopover
                  selectedColor={formData.primaryColor}
                  onSelect={(c) => handleInputChange("primaryColor", colorToSolid(c))}
                  mode="solid"
                  label="Primary Color"
                  width={220}
                >
                  <div className="flex gap-2 cursor-pointer">
                    <div className="w-12 h-10 rounded border border-neutral-300 dark:border-neutral-600" style={{ backgroundColor: formData.primaryColor }} />
                    <div className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm font-mono">
                      {formData.primaryColor}
                    </div>
                  </div>
                </ColorPickerPopover>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Secondary Color
                </label>
                <ColorPickerPopover
                  selectedColor={formData.secondaryColor}
                  onSelect={(c) => handleInputChange("secondaryColor", colorToSolid(c))}
                  mode="solid"
                  label="Secondary Color"
                  width={220}
                >
                  <div className="flex gap-2 cursor-pointer">
                    <div className="w-12 h-10 rounded border border-neutral-300 dark:border-neutral-600" style={{ backgroundColor: formData.secondaryColor }} />
                    <div className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100 text-sm font-mono">
                      {formData.secondaryColor}
                    </div>
                  </div>
                </ColorPickerPopover>
              </div>
            </div>
          </div>

          {/* Bank Account */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <Building2 className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                Bank Account (Optional)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => handleInputChange("bankName", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., First Bank Nigeria"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange("accountNumber", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., 1234567890"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Account Name
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) => handleInputChange("accountName", e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-100"
                  placeholder="e.g., School Name Ltd"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isSubmitting ? "Creating..." : "Create School"}
            </Button>
          </div>

          {errors.submit && (
            <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
            </div>
          )}
      </form>
    </AdminPageShell>
  );
}
