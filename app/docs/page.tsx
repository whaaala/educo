"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Book, FileText, CheckCircle, Zap, Code, Settings } from "lucide-react";
import { useFeatureFlags } from "@/hooks/useFeatureFlags";

export default function DocsPage() {
  const [activeDoc, setActiveDoc] = useState<string>("overview");
  const [isMounted, setIsMounted] = useState(false);
  const { enabledFeatures, tenantContext } = useFeatureFlags();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading documentation...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const docs = [
    {
      id: "overview",
      title: "Overview",
      icon: Book,
      description: "Introduction to Educo v4.0 architecture",
    },
    {
      id: "feature-flags",
      title: "Feature Flags",
      icon: Settings,
      description: "Complete guide to feature flags",
    },
    {
      id: "quick-start",
      title: "Quick Start",
      icon: Zap,
      description: "Get started with development",
    },
    {
      id: "implementation",
      title: "Implementation Status",
      icon: CheckCircle,
      description: "Track implementation progress",
    },
    {
      id: "tenant-info",
      title: "Tenant Info",
      icon: Code,
      description: "Current tenant configuration",
    },
  ];

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Custom Header for Docs */}
        <div className="w-full lg:w-auto lg:flex-shrink-0 p-6 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-8 h-8 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400" />
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Documentation
            </h1>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
            Feature flags, multi-tenant architecture, and implementation guides
          </p>
        </div>

        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 space-y-2">
            {docs.map((doc) => {
              const Icon = doc.icon;
              return (
                <button
                  key={doc.id}
                  onClick={() => setActiveDoc(doc.id)}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                    activeDoc === doc.id
                      ? "bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border-2 border-blue-500 dark:border-blue-600 midnight:border-cyan-500 purple:border-pink-500"
                      : "bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 hover:border-blue-300 dark:hover:border-blue-600"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-1">
                    <Icon
                      className={`w-5 h-5 ${
                        activeDoc === doc.id
                          ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                          : "text-gray-600 dark:text-gray-400"
                      }`}
                    />
                    <span
                      className={`font-semibold text-sm ${
                        activeDoc === doc.id
                          ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                          : "text-gray-900 dark:text-gray-100"
                      }`}
                    >
                      {doc.title}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 ml-8">
                    {doc.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Content */}
          <div className="flex-1 bg-white dark:bg-gray-800 midnight:bg-gray-800 purple:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 overflow-auto">
            <div className="p-8">
              {activeDoc === "overview" && <OverviewDoc />}
              {activeDoc === "feature-flags" && <FeatureFlagsDoc />}
              {activeDoc === "quick-start" && <QuickStartDoc />}
              {activeDoc === "implementation" && <ImplementationDoc />}
              {activeDoc === "tenant-info" && (
                <TenantInfoDoc
                  tenantContext={tenantContext}
                  enabledFeatures={enabledFeatures}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

// Overview Documentation Component
function OverviewDoc() {
  return (
    <div className="prose prose-blue dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
        Educo v4.0 Overview
      </h1>

      <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border-l-4 border-blue-500 dark:border-blue-600 midnight:border-cyan-500 purple:border-pink-500 p-4 mb-6 rounded-r-lg">
        <p className="text-sm text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100 m-0">
          <strong>Educo v4.0</strong> is a unified School ERP and Digital Management Platform with multi-tenant
          architecture, feature flags, and support for Primary to Tertiary institutions across Africa.
        </p>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-8 mb-4">
        Key Features
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 p-5 rounded-lg border border-blue-200 dark:border-blue-800 midnight:border-cyan-500/30 purple:border-pink-500/30">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
            🏢 Multi-Tenant Architecture
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
            Schema-per-tenant isolation with independent backups and configurations for each school.
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 midnight:from-blue-900/20 midnight:to-purple-900/20 purple:from-purple-900/20 purple:to-pink-900/20 p-5 rounded-lg border border-purple-200 dark:border-purple-800 midnight:border-cyan-500/30 purple:border-pink-500/30">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
            🚩 Feature Flags
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
            40+ feature flags for modular rollout based on education level, institution type, and region.
          </p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 midnight:from-green-900/20 midnight:to-emerald-900/20 purple:from-green-900/20 purple:to-emerald-900/20 p-5 rounded-lg border border-green-200 dark:border-green-800 midnight:border-cyan-500/30 purple:border-pink-500/30">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
            🎓 Education Level Support
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
            Primary, Secondary, and Tertiary institutions with level-specific features and grading systems.
          </p>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 midnight:from-amber-900/20 midnight:to-orange-900/20 purple:from-amber-900/20 purple:to-orange-900/20 p-5 rounded-lg border border-amber-200 dark:border-amber-800 midnight:border-cyan-500/30 purple:border-pink-500/30">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
            🌍 Regional Support
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
            Support for Nigeria, Ghana, Kenya, South Africa, Uganda with local exams and payment gateways.
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-8 mb-4">
        Architecture Components
      </h2>

      <ul className="space-y-2 text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-1">▸</span>
          <span><strong>Frontend:</strong> Next.js with React, Tailwind CSS, TypeScript</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-1">▸</span>
          <span><strong>Mobile:</strong> React Native (planned)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-1">▸</span>
          <span><strong>Backend:</strong> Node.js + Express (planned)</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-1">▸</span>
          <span><strong>Database:</strong> Supabase (PostgreSQL) with schema-per-tenant</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-1">▸</span>
          <span><strong>Authentication:</strong> Supabase Auth with JWT and RBAC</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-1">▸</span>
          <span><strong>Payments:</strong> Paystack, Interswitch, Flutterwave</span>
        </li>
        <li className="flex items-start gap-2">
          <span className="text-blue-500 mt-1">▸</span>
          <span><strong>Communication:</strong> WhatsApp, Zoom, Google Calendar, SendGrid</span>
        </li>
      </ul>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-8 mb-4">
        Quick Links
      </h2>

      <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border-l-4 border-blue-500 dark:border-blue-600 midnight:border-cyan-500 purple:border-pink-500 p-4 rounded-r-lg mt-8">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100 mb-2">
          📄 Markdown Files Location
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200 mb-2">
          All documentation is also available as markdown files in your project:
        </p>
        <ul className="text-sm text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200 space-y-1">
          <li><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">docs/FEATURE_FLAGS.md</code></li>
          <li><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">docs/QUICK_START.md</code></li>
          <li><code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">docs/IMPLEMENTATION_STATUS.md</code></li>
        </ul>
        <p className="text-sm text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200 mt-2">
          Open these files in VS Code or your preferred editor.
        </p>
      </div>
    </div>
  );
}

// Feature Flags Documentation Component
function FeatureFlagsDoc() {
  const featureFlagCategories = [
    {
      category: "Student Management",
      flags: [
        { name: "FF_Student_Profile", desc: "Student ID & digital profile", enabled: true },
        { name: "FF_Student_Transfer", desc: "Cross-branch transfers", enabled: true },
        { name: "FF_Student_Grading", desc: "Grading and assessment", enabled: true },
      ],
    },
    {
      category: "Finance Management",
      flags: [
        { name: "FF_Finance_Private", desc: "Private institution payments", enabled: true },
        { name: "FF_Finance_Public", desc: "Public institution payments", enabled: true },
        { name: "FF_Finance_Tertiary", desc: "Tertiary fees", enabled: true },
      ],
    },
    {
      category: "Grading Systems",
      flags: [
        { name: "FF_Grading_Primary", desc: "Primary school grading", enabled: true },
        { name: "FF_Grading_Secondary", desc: "Secondary grading (WAEC)", enabled: true },
        { name: "FF_Grading_Tertiary", desc: "Tertiary grading (GPA)", enabled: true },
      ],
    },
    {
      category: "Communication",
      flags: [
        { name: "FF_Chat_WhatsApp", desc: "WhatsApp integration", enabled: true },
        { name: "FF_Call_Zoom", desc: "Zoom integration", enabled: true },
        { name: "FF_GoogleCalendar", desc: "Calendar sync", enabled: true },
        { name: "FF_Email_SendGrid", desc: "Email notifications", enabled: true },
      ],
    },
  ];

  return (
    <div className="prose prose-blue dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
        Feature Flags
      </h1>

      <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-6">
        Educo v4.0 uses feature flags to control which features are available based on education level,
        institution type, and region. This enables modular rollout and tenant-specific customization.
      </p>

      {featureFlagCategories.map((category) => (
        <div key={category.category} className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
            {category.category}
          </h2>

          <div className="space-y-3">
            {category.flags.map((flag) => (
              <div
                key={flag.name}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-700/50 midnight:bg-gray-700/50 purple:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
              >
                <div className="flex-1">
                  <code className="text-sm font-mono text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400">
                    {flag.name}
                  </code>
                  <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70 mt-1">
                    {flag.desc}
                  </p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    flag.enabled
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                  }`}
                >
                  {flag.enabled ? "Enabled" : "Disabled"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="bg-amber-50 dark:bg-amber-900/20 midnight:bg-amber-900/20 purple:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg mt-8">
        <h3 className="font-bold text-amber-900 dark:text-amber-100 midnight:text-amber-100 purple:text-amber-100 mb-2">
          📝 Usage Example
        </h3>
        <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto mt-3">
          <code>{`import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function MyComponent() {
  const { canTransferStudents } = useFeatureFlags();

  return (
    <>
      {canTransferStudents && <TransferButton />}
    </>
  );
}`}</code>
        </pre>
      </div>
    </div>
  );
}

// Quick Start Documentation Component
function QuickStartDoc() {
  return (
    <div className="prose prose-blue dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
        Quick Start Guide
      </h1>

      <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-6">
        Get started with feature flags and multi-tenant architecture in your components.
      </p>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-8 mb-4">
        1. Basic Feature Check
      </h2>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
        <code>{`import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function StudentTransferButton() {
  const { canTransferStudents, tenantContext } = useFeatureFlags();

  if (!canTransferStudents) return null;

  return <button>Transfer Student</button>;
}`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-8 mb-4">
        2. Using Feature Guards
      </h2>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
        <code>{`import StudentFeatureGuard from "@/components/students/StudentFeatureGuard";

function MyPage() {
  return (
    <StudentFeatureGuard feature="FF_Hostel_Management">
      <HostelSection />
    </StudentFeatureGuard>
  );
}`}</code>
      </pre>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mt-8 mb-4">
        3. Accessing Tenant Context
      </h2>

      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
        <code>{`import { useFeatureFlags } from "@/hooks/useFeatureFlags";

function TenantInfo() {
  const { tenantContext } = useFeatureFlags();

  return (
    <div>
      <p>Tenant: {tenantContext.tenantId}</p>
      <p>Region: {tenantContext.region}</p>
      <p>Level: {tenantContext.educationLevel}</p>
      <p>Type: {tenantContext.institutionType}</p>
    </div>
  );
}`}</code>
      </pre>

      <div className="bg-blue-50 dark:bg-blue-900/20 midnight:bg-cyan-900/20 purple:bg-pink-900/20 border-l-4 border-blue-500 dark:border-blue-600 midnight:border-cyan-500 purple:border-pink-500 p-4 rounded-r-lg mt-8">
        <h3 className="font-bold text-blue-900 dark:text-blue-100 midnight:text-cyan-100 purple:text-pink-100 mb-2">
          💡 Pro Tip
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-200 midnight:text-cyan-200 purple:text-pink-200 m-0">
          Always wrap feature-specific UI in feature guards to ensure they only render when the feature
          is enabled for the current tenant context.
        </p>
      </div>
    </div>
  );
}

// Implementation Status Documentation Component
function ImplementationDoc() {
  const implementationStatus = [
    { phase: "Multi-Tenant Foundation", status: "completed", progress: 100 },
    { phase: "Feature Flag System", status: "completed", progress: 100 },
    { phase: "Student Management UI", status: "completed", progress: 100 },
    { phase: "Education Level System", status: "completed", progress: 100 },
    { phase: "Student Transfer Workflow", status: "pending", progress: 0 },
    { phase: "Grading System", status: "pending", progress: 0 },
    { phase: "Finance Module", status: "pending", progress: 0 },
    { phase: "Communication Suite", status: "pending", progress: 0 },
  ];

  return (
    <div className="prose prose-blue dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
        Implementation Status
      </h1>

      <p className="text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200 mb-6">
        Track the progress of Educo v4.0 feature implementation.
      </p>

      <div className="space-y-4">
        {implementationStatus.map((item) => (
          <div
            key={item.phase}
            className="p-4 bg-white dark:bg-gray-700/50 midnight:bg-gray-700/50 purple:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {item.phase}
              </h3>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  item.status === "completed"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : item.status === "in-progress"
                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
                }`}
              >
                {item.status === "completed" ? "✅ Completed" : item.status === "in-progress" ? "🚧 In Progress" : "📋 Pending"}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  item.progress === 100
                    ? "bg-green-500 dark:bg-green-600"
                    : item.progress > 0
                    ? "bg-blue-500 dark:bg-blue-600"
                    : "bg-gray-300 dark:bg-gray-600"
                }`}
                style={{ width: `${item.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{item.progress}% complete</p>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 midnight:from-green-900/20 midnight:to-emerald-900/20 purple:from-green-900/20 purple:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800 midnight:border-cyan-500/50 purple:border-pink-500/50">
        <h3 className="text-xl font-bold text-green-900 dark:text-green-100 midnight:text-green-100 purple:text-green-100 mb-3">
          ✅ Completed in Phase 1
        </h3>
        <ul className="space-y-2 text-green-800 dark:text-green-200 midnight:text-green-200 purple:text-green-200">
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Multi-tenant architecture foundation with schema-per-tenant</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Feature flag system with 40+ flags</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Education level badges and auto-detection</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Institution type badges</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Delete workflow with confirmation</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Feature guard components</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-600 mt-1">✓</span>
            <span>Comprehensive documentation</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

// Tenant Info Component
function TenantInfoDoc({
  tenantContext,
  enabledFeatures,
}: {
  tenantContext: any;
  enabledFeatures: string[];
}) {
  return (
    <div className="prose prose-blue dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
        Current Tenant Information
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 midnight:from-cyan-900/20 midnight:to-blue-900/20 purple:from-pink-900/20 purple:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800 midnight:border-cyan-500/50 purple:border-pink-500/50">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
            Tenant Details
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Tenant ID
              </dt>
              <dd className="text-base font-mono text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {tenantContext.tenantId || "default"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Region
              </dt>
              <dd className="text-base font-mono text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {tenantContext.region || "Nigeria"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Education Level
              </dt>
              <dd className="text-base font-mono text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {tenantContext.educationLevel || "Secondary"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Institution Type
              </dt>
              <dd className="text-base font-mono text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {tenantContext.institutionType || "Private"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Subdomain
              </dt>
              <dd className="text-base font-mono text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                {tenantContext.subdomain || "demo.educo.africa"}
              </dd>
            </div>
          </dl>
        </div>

        <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 midnight:from-blue-900/20 midnight:to-purple-900/20 purple:from-purple-900/20 purple:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800 midnight:border-cyan-500/50 purple:border-pink-500/50">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
            Statistics
          </h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Enabled Features
              </dt>
              <dd className="text-3xl font-bold text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400">
                {enabledFeatures.length}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-semibold text-gray-600 dark:text-gray-400 midnight:text-cyan-300/70 purple:text-pink-300/70">
                Total Features
              </dt>
              <dd className="text-3xl font-bold text-purple-600 dark:text-purple-400 midnight:text-purple-400 purple:text-purple-400">
                40+
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-4">
        Enabled Features ({enabledFeatures.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-auto p-1">
        {enabledFeatures.map((feature) => (
          <div
            key={feature}
            className="px-3 py-2 bg-green-50 dark:bg-green-900/20 midnight:bg-green-900/20 purple:bg-green-900/20 border border-green-200 dark:border-green-800 midnight:border-green-700 purple:border-green-700 rounded-lg"
          >
            <code className="text-xs font-mono text-green-700 dark:text-green-300 midnight:text-green-300 purple:text-green-300">
              {feature}
            </code>
          </div>
        ))}
      </div>
    </div>
  );
}
