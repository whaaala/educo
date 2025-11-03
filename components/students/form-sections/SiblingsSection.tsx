"use client";

import { UserPlus, Trash2, Users2 } from "lucide-react";

interface Sibling {
  id: string;
  name: string;
  class: string;
  section: string;
}

interface SiblingsSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
}

export default function SiblingsSection({
  formData,
  onChange,
}: SiblingsSectionProps) {
  const siblings: Sibling[] = formData.siblings || [];

  const addSibling = () => {
    const newSibling: Sibling = {
      id: Date.now().toString(),
      name: "",
      class: "",
      section: "",
    };
    onChange("siblings", [...siblings, newSibling]);
  };

  const removeSibling = (id: string) => {
    onChange(
      "siblings",
      siblings.filter((s) => s.id !== id)
    );
  };

  const updateSibling = (id: string, field: keyof Sibling, value: string) => {
    onChange(
      "siblings",
      siblings.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
      {/* Section Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-600 dark:to-purple-600 midnight:from-indigo-700 midnight:to-purple-700 purple:from-purple-600 purple:to-indigo-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Users2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Siblings Information
              </h2>
              <p className="text-sm text-white/80">
                Add sibling details studying in the same school
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={addSibling}
            className="px-4 py-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white font-medium text-sm transition-all duration-200 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            Add Sibling
          </button>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6 space-y-6">
        {siblings.length === 0 ? (
          <div className="text-center py-12">
            <Users2 className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mb-4">
              No siblings added yet
            </p>
            <button
              type="button"
              onClick={addSibling}
              className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 midnight:bg-cyan-600 midnight:hover:bg-cyan-700 purple:bg-pink-600 purple:hover:bg-pink-700 text-white font-medium transition-all duration-200 flex items-center gap-2 mx-auto"
            >
              <UserPlus className="w-5 h-5" />
              Add First Sibling
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {siblings.map((sibling, index) => (
              <div
                key={sibling.id}
                className="p-5 rounded-lg border-2 border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 space-y-4"
              >
                {/* Sibling Header */}
                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 pb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white midnight:text-cyan-300 purple:text-pink-300">
                    Sibling {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeSibling(sibling.id)}
                    className="px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 midnight:hover:bg-red-900/50 purple:hover:bg-red-900/50 text-red-700 dark:text-red-400 midnight:text-red-400 purple:text-red-400 font-medium text-sm transition-all duration-200 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>

                {/* Sibling Fields */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sibling Name */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                      Sibling Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={sibling.name}
                      onChange={(e) =>
                        updateSibling(sibling.id, "name", e.target.value)
                      }
                      placeholder="Enter sibling's full name"
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
                    />
                  </div>

                  {/* Class */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                      Class <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={sibling.class}
                      onChange={(e) =>
                        updateSibling(sibling.id, "class", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
                    >
                      <option value="">Select Class</option>
                      <optgroup label="Primary">
                        <option value="Primary 1">Primary 1</option>
                        <option value="Primary 2">Primary 2</option>
                        <option value="Primary 3">Primary 3</option>
                        <option value="Primary 4">Primary 4</option>
                        <option value="Primary 5">Primary 5</option>
                        <option value="Primary 6">Primary 6</option>
                      </optgroup>
                      <optgroup label="Junior Secondary">
                        <option value="JSS 1">JSS 1</option>
                        <option value="JSS 2">JSS 2</option>
                        <option value="JSS 3">JSS 3</option>
                      </optgroup>
                      <optgroup label="Senior Secondary">
                        <option value="SS 1">SS 1</option>
                        <option value="SS 2">SS 2</option>
                        <option value="SS 3">SS 3</option>
                      </optgroup>
                    </select>
                  </div>

                  {/* Section */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-2">
                      Section <span className="text-red-500">*</span>
                    </label>
                    <select
                      required
                      value={sibling.section}
                      onChange={(e) =>
                        updateSibling(sibling.id, "section", e.target.value)
                      }
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 midnight:focus:ring-cyan-400 purple:focus:ring-pink-400 transition-all"
                    >
                      <option value="">Select Section</option>
                      <option value="A">Section A</option>
                      <option value="B">Section B</option>
                      <option value="C">Section C</option>
                      <option value="D">Section D</option>
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {/* Add Another Button */}
            <button
              type="button"
              onClick={addSibling}
              className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 midnight:border-cyan-500/30 purple:border-pink-500/30 bg-gray-50 dark:bg-gray-800/30 midnight:bg-gray-900/30 purple:bg-gray-900/30 hover:bg-gray-100 dark:hover:bg-gray-800/50 midnight:hover:bg-gray-900/50 purple:hover:bg-gray-900/50 text-gray-600 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Add Another Sibling
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
