"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Save, RotateCcw, AlertCircle, CheckCircle, Copy } from "lucide-react";
import CustomDropdown from "@/components/shared/CustomDropdown";
import {
  type EducationLevel,
  type GradingComponentConfig,
  type SubjectGradingConfig,
  getDefaultComponentsForLevel,
  validateGradingWeights,
  createCustomComponent,
  saveSubjectGradingConfig,
  loadSubjectGradingConfig,
  resetToDefaults,
} from "@/lib/gradingConfig";

interface GradingSystemConfigProps {
  subjectId: string;
  subjectCode: string;
  subjectName: string;
  educationLevel: EducationLevel;
  onSave?: (config: SubjectGradingConfig) => void;
}

export default function GradingSystemConfig({
  subjectId,
  subjectCode,
  subjectName,
  educationLevel,
  onSave,
}: GradingSystemConfigProps) {
  const [components, setComponents] = useState<GradingComponentConfig[]>([]);
  const [customName, setCustomName] = useState("");
  const [customWeight, setCustomWeight] = useState<number>(0);
  const [customCategory, setCustomCategory] = useState<GradingComponentConfig["category"]>("Academic");
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Load config on mount
  useEffect(() => {
    const stored = loadSubjectGradingConfig(educationLevel, subjectCode);
    if (stored) {
      setComponents(stored.components);
    } else {
      setComponents(getDefaultComponentsForLevel(educationLevel));
    }
  }, [educationLevel, subjectCode]);

  // Validation
  const validation = validateGradingWeights(components);

  // Toggle component enabled/disabled
  const toggleComponent = (componentId: string) => {
    setComponents(prev =>
      prev.map(c =>
        c.id === componentId ? { ...c, enabled: !c.enabled } : c
      )
    );
  };

  // Update component weight
  const updateWeight = (componentId: string, weight: number) => {
    // Ensure weight is always >= 0
    const validWeight = Math.max(0, weight);
    setComponents(prev =>
      prev.map(c =>
        c.id === componentId ? { ...c, defaultWeight: validWeight } : c
      )
    );
  };

  // Update component title (custom label to signify the type/purpose)
  const updateTitle = (componentId: string, title: string) => {
    setComponents(prev =>
      prev.map(c =>
        c.id === componentId ? { ...c, title } : c
      )
    );
  };

  // Add custom component
  const addCustomComponent = () => {
    if (!customName.trim() || customWeight <= 0) {
      alert("Please provide a valid name and weight");
      return;
    }

    const newComponent = createCustomComponent(
      customName,
      customWeight,
      customCategory,
      educationLevel
    );

    setComponents(prev => [...prev, newComponent]);
    setCustomName("");
    setCustomWeight(0);
    setShowAddCustom(false);
  };

  // Duplicate an existing component (for adding multiple instances like "Class Test 1", "Class Test 2")
  const duplicateComponent = (componentId: string) => {
    const componentToDuplicate = components.find(c => c.id === componentId);
    if (!componentToDuplicate) return;

    // Count how many instances of this component type already exist
    const existingCount = components.filter(c =>
      c.name.startsWith(componentToDuplicate.name.replace(/\s+\d+$/, ''))
    ).length;

    const duplicatedComponent = createCustomComponent(
      `${componentToDuplicate.name.replace(/\s+\d+$/, '')} ${existingCount + 1}`,
      componentToDuplicate.defaultWeight,
      componentToDuplicate.category,
      educationLevel
    );

    setComponents(prev => [...prev, duplicatedComponent]);
  };

  // Remove component (custom or duplicated)
  const removeComponent = (componentId: string) => {
    const component = components.find(c => c.id === componentId);
    if (!component) return;

    // Only allow removal of custom components or duplicates (components with numbers in names)
    if (component.isCustom || /\s+\d+$/.test(component.name)) {
      setComponents(prev => prev.filter(c => c.id !== componentId));
    } else {
      alert("Cannot remove default components. You can disable them using the checkbox instead.");
    }
  };

  // Save configuration
  const handleSave = () => {
    if (!validation.isValid) {
      alert("Please fix validation errors before saving");
      return;
    }

    setSaveStatus("saving");

    const config: SubjectGradingConfig = {
      subjectId,
      subjectCode,
      subjectName,
      educationLevel,
      components,
      totalWeightMustBe100: true,
      customComponents: components.filter(c => c.isCustom),
    };

    try {
      saveSubjectGradingConfig(config);
      setSaveStatus("saved");
      onSave?.(config);

      // Dispatch event for other components to update
      window.dispatchEvent(
        new CustomEvent("gradingConfigUpdated", {
          detail: { subjectCode, educationLevel, config },
        })
      );

      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      setSaveStatus("error");
      setTimeout(() => setSaveStatus("idle"), 3000);
    }
  };

  // Reset to defaults
  const handleReset = () => {
    if (confirm("Are you sure you want to reset to default grading configuration?")) {
      resetToDefaults(educationLevel, subjectCode);
      setComponents(getDefaultComponentsForLevel(educationLevel));
    }
  };

  const categoryOptions = [
    { label: "Academic", value: "Academic" },
    { label: "Practical", value: "Practical" },
    { label: "Behavioral", value: "Behavioral" },
    { label: "Co-curricular", value: "Co-curricular" },
    { label: "Professional", value: "Professional" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
            Grading Configuration
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/80 purple:text-pink-400/80 mt-1">
            {subjectName} ({subjectCode}) • {educationLevel.charAt(0).toUpperCase() + educationLevel.slice(1)} Level
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Reset to Defaults
          </button>
          <button
            onClick={handleSave}
            disabled={!validation.isValid || saveStatus === "saving"}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {saveStatus === "saving" ? "Saving..." : "Save Configuration"}
          </button>
        </div>
      </div>

      {/* Validation Status */}
      {!validation.isValid && (
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">
              Configuration Error
            </p>
            <ul className="mt-2 space-y-1 text-sm text-red-700 dark:text-red-400">
              {validation.errors.map((error, idx) => (
                <li key={idx}>• {error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {validation.isValid && saveStatus === "saved" && (
        <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
          <p className="text-sm font-semibold text-green-800 dark:text-green-300">
            Configuration saved successfully!
          </p>
        </div>
      )}

      {/* Total Weight Display */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Total Weight (Enabled Components):
          </span>
          <span className={`text-2xl font-bold ${
            validation.totalWeight === 100
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}>
            {validation.totalWeight}%
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              validation.totalWeight === 100
                ? "bg-green-500"
                : validation.totalWeight > 100
                ? "bg-red-500"
                : "bg-yellow-500"
            }`}
            style={{ width: `${Math.min(validation.totalWeight, 100)}%` }}
          />
        </div>
      </div>

      {/* Components List */}
      <div className="space-y-3">
        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 midnight:text-cyan-200 purple:text-pink-200">
          Assessment Components
        </h4>

        {components.map((component) => (
          <div
            key={component.id}
            className={`p-4 rounded-lg border transition-all ${
              component.enabled
                ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                : "bg-gray-50 dark:bg-gray-800/50 border-gray-300 dark:border-gray-700 opacity-60"
            }`}
          >
            <div className="flex items-start gap-4">
              {/* Enable/Disable Toggle */}
              <div className="flex items-center pt-1">
                <input
                  type="checkbox"
                  checked={component.enabled}
                  onChange={() => toggleComponent(component.id)}
                  className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              {/* Component Info */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h5 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {component.name}
                  </h5>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
                    component.category === "Academic" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300" :
                    component.category === "Practical" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300" :
                    component.category === "Behavioral" ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" :
                    component.category === "Co-curricular" ? "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300" :
                    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                  }`}>
                    {component.category}
                  </span>
                  {component.isCustom && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300">
                      Custom
                    </span>
                  )}
                  <button
                    onClick={() => duplicateComponent(component.id)}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    title="Add another instance"
                  >
                    <Copy className="w-3 h-3" />
                    Add Another
                  </button>
                </div>

                {/* Title Input - Custom label to signify type/purpose */}
                <div>
                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title (Optional):
                  </label>
                  <input
                    type="text"
                    value={component.title || ""}
                    onChange={(e) => updateTitle(component.id, e.target.value)}
                    disabled={!component.enabled}
                    placeholder={`e.g., "First CA", "Mid-term Test", "Final Project"`}
                    className="w-full px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600"
                  />
                </div>

                {component.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {component.description}
                  </p>
                )}

                <div className="flex items-center gap-4">
                  {/* Max Score Display */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Max Score:
                    </label>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {component.maxScore || 100}%
                    </span>
                  </div>

                  {/* Weight Input */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
                      Weight: 0% -
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={component.defaultWeight}
                      onChange={(e) => updateWeight(component.id, Number(e.target.value))}
                      disabled={!component.enabled}
                      className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">%</span>
                  </div>
                </div>
              </div>

              {/* Remove Button (Custom Components or Duplicates) */}
              {(component.isCustom || /\s+\d+$/.test(component.name)) && (
                <button
                  onClick={() => removeComponent(component.id)}
                  className="flex items-center justify-center w-8 h-8 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  title="Remove component"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Component */}
      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        {!showAddCustom ? (
          <button
            onClick={() => setShowAddCustom(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Custom Component
          </button>
        ) : (
          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg space-y-3 relative z-10">
            <h5 className="text-sm font-bold text-gray-900 dark:text-gray-100">
              Add Custom Grading Component
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Component Name
                </label>
                <input
                  type="text"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="e.g., Portfolio Assessment"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Weight (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={customWeight}
                  onChange={(e) => setCustomWeight(Number(e.target.value))}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <CustomDropdown
                  value={customCategory}
                  options={categoryOptions}
                  onChange={(value) => setCustomCategory(value as GradingComponentConfig["category"])}
                  variant="blue"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={addCustomComponent}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Component
              </button>
              <button
                onClick={() => {
                  setShowAddCustom(false);
                  setCustomName("");
                  setCustomWeight(0);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
