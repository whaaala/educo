"use client";

import { useState } from "react";
import ExamResults from "@/components/students/ExamResults";
import CustomDropdown from "@/components/shared/CustomDropdown";

export default function GradingDemo() {
  const [educationLevel, setEducationLevel] = useState<"primary" | "secondary" | "tertiary">("secondary");
  const [allowConfiguration, setAllowConfiguration] = useState(true);

  const educationLevelOptions = [
    { label: "Primary School", value: "primary" },
    { label: "Secondary School", value: "secondary" },
    { label: "Tertiary/University", value: "tertiary" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Demo Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Configurable Grading System Demo
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
            This demo showcases the Adaptive Grading Engine (AGE) with configurable grading components per subject/module.
            Click the settings icon next to any subject to configure its grading system.
          </p>

          {/* Demo Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Education Level
              </label>
              <CustomDropdown
                value={educationLevel}
                options={educationLevelOptions}
                onChange={(value) => setEducationLevel(value as "primary" | "secondary" | "tertiary")}
                variant="blue"
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Configuration Access
              </label>
              <button
                onClick={() => setAllowConfiguration(!allowConfiguration)}
                className={`w-full px-4 py-2 rounded-lg font-medium transition-colors ${
                  allowConfiguration
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-700"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600"
                }`}
              >
                {allowConfiguration ? "✓ Configuration Enabled (Teacher/Admin)" : "✗ Configuration Disabled (Student)"}
              </button>
            </div>
          </div>

          {/* Feature List */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300 mb-2">Features:</h3>
            <ul className="text-xs text-blue-800 dark:text-blue-400 space-y-1">
              <li>• Turn on/off individual grading components (Classwork, Tests, Projects, Behavior, etc.)</li>
              <li>• Adjust weight percentage for each component</li>
              <li>• Add custom grading components with name, weight, and category</li>
              <li>• Real-time validation ensuring total weights equal 100%</li>
              <li>• Configuration saved per subject/module in localStorage</li>
              <li>• Different default components for Primary, Secondary, and Tertiary levels</li>
            </ul>
          </div>
        </div>

        {/* Exam Results with Configurable Grading */}
        <ExamResults
          educationLevel={educationLevel}
          allowConfiguration={allowConfiguration}
        />
      </div>
    </div>
  );
}
