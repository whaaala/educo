"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/shared/PageHeader";
import PageLoader from "@/components/shared/PageLoader";
import GradingSystemConfig from "@/components/settings/GradingSystemConfig";
import CustomDropdown from "@/components/shared/CustomDropdown";
import { usePageLoad } from "@/hooks/usePageLoad";
import { GraduationCap } from "lucide-react";
import type { EducationLevel } from "@/lib/gradingConfig";

// Mock subjects/modules data for configuration
const MOCK_SUBJECTS = {
  primary: [
    { id: "pri-eng", code: "ENG101", name: "English Language" },
    { id: "pri-math", code: "MATH101", name: "Mathematics" },
    { id: "pri-sci", code: "SCI101", name: "Basic Science" },
  ],
  secondary: [
    { id: "sec-bio", code: "BIO105", name: "Biology" },
    { id: "sec-phy", code: "PHY103", name: "Physics" },
    { id: "sec-chem", code: "CHM104", name: "Chemistry" },
  ],
  tertiary: [
    { id: "ter-cs", code: "CSC301", name: "Data Structures" },
    { id: "ter-eng", code: "ENG401", name: "Software Engineering" },
    { id: "ter-db", code: "CSC305", name: "Database Systems" },
  ],
};

export default function GradingConfigPage() {
  const isLoading = usePageLoad(800);
  const [educationLevel, setEducationLevel] = useState<EducationLevel>("secondary");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const educationLevelOptions = [
    { label: "Primary School", value: "primary" },
    { label: "Secondary School", value: "secondary" },
    { label: "Tertiary/University", value: "tertiary" },
  ];

  const subjects = MOCK_SUBJECTS[educationLevel];
  const subjectOptions = subjects.map(s => ({ label: `${s.code} - ${s.name}`, value: s.id }));

  const currentSubject = subjects.find(s => s.id === selectedSubject) || subjects[0];

  return (
    <MainLayout>
      {/* Loading Screen */}
      <PageLoader isLoading={isLoading} loadingText="Loading Grading Configuration" />

      {/* Main Content */}
      <div className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Header */}
        <div className="py-4 mb-2">
          <PageHeader
            title="Grading System Configuration"
            breadcrumbs={[
              { label: "Dashboard", href: "/" },
              { label: "Settings", href: "/settings" },
              { label: "Grading Configuration", isActive: true },
            ]}
          />
        </div>

        {/* Configuration Content */}
        <div className="pb-20 space-y-6">
          {/* Info Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 mb-2">
                    Configure Grading Components
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80">
                    Customize how each subject or module is graded by enabling/disabling assessment components,
                    adjusting their weights, and adding custom grading types. Each configuration is saved per subject/module.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Selection Controls */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Education Level Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                    Education Level
                  </label>
                  <CustomDropdown
                    value={educationLevel}
                    options={educationLevelOptions}
                    onChange={(value) => {
                      setEducationLevel(value as EducationLevel);
                      setSelectedSubject(""); // Reset subject selection
                    }}
                    variant="blue"
                    className="w-full"
                  />
                </div>

                {/* Subject/Module Selector */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                    Subject / Module
                  </label>
                  <CustomDropdown
                    value={selectedSubject || currentSubject.id}
                    options={subjectOptions}
                    onChange={(value) => setSelectedSubject(value)}
                    variant="blue"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Grading Configuration Section */}
          <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm">
            <div className="p-6">
              <GradingSystemConfig
                subjectId={currentSubject.id}
                subjectCode={currentSubject.code}
                subjectName={currentSubject.name}
                educationLevel={educationLevel}
              />
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
