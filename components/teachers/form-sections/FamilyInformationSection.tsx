"use client";

import { useState } from "react";
import {
  Users,
  ChevronUp,
  User,
  Phone,
  Plus,
  X,
  Baby,
} from "lucide-react";
import FormInput from "@/components/shared/FormInput";
import { ValidationErrors } from "@/lib/validation";

interface Dependent {
  id: string;
  name: string;
  age: string;
  school: string;
}

interface FamilyInformationSectionProps {
  formData: any;
  onChange: (field: string, value: any) => void;
  errors?: ValidationErrors;
}

export default function FamilyInformationSection({
  formData,
  onChange,
  errors = {},
}: FamilyInformationSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const dependents: Dependent[] = formData.dependents || [];

  const addDependent = () => {
    const newDependent: Dependent = {
      id: Date.now().toString(),
      name: "",
      age: "",
      school: "",
    };
    onChange("dependents", [...dependents, newDependent]);
  };

  const removeDependent = (id: string) => {
    onChange(
      "dependents",
      dependents.filter((dep) => dep.id !== id)
    );
  };

  const updateDependent = (id: string, field: keyof Dependent, value: string) => {
    onChange(
      "dependents",
      dependents.map((dep) =>
        dep.id === id ? { ...dep, [field]: value } : dep
      )
    );
  };

  return (
    <section className="bg-white dark:bg-gray-800 midnight:bg-gray-900 purple:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20 shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Collapsible Header */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-indigo-50/50 dark:bg-indigo-900/10 midnight:bg-indigo-900/10 purple:bg-indigo-900/10 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 midnight:hover:bg-indigo-900/20 purple:hover:bg-indigo-900/20 px-6 py-3 flex items-center justify-between transition-all duration-200 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 flex items-center justify-center">
            <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
          </div>
          <div className="text-left">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
              Family Information
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
              Spouse and dependents information
            </p>
          </div>
        </div>
        <div className="text-gray-500 dark:text-gray-400 midnight:text-cyan-400 purple:text-pink-400 cursor-pointer">
          <ChevronUp
            className={`w-4 h-4 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
              isExpanded ? "rotate-0" : "rotate-180"
            }`}
          />
        </div>
      </button>

      {/* Collapsible Content */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className={isExpanded ? "overflow-visible" : "overflow-hidden"}>
          <div className="p-4 sm:p-6 space-y-6 sm:space-y-8 lg:space-y-10">
            {/* Spouse Information Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 midnight:bg-indigo-900/20 purple:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                  Spouse Information
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5 lg:gap-y-7 pl-2">
                <FormInput
                  label="Spouse Name"
                  icon={<User className="w-full h-full" />}
                  iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
                  iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
                  value={formData.spouseName || ""}
                  onChange={(value) => onChange("spouseName", value)}
                  placeholder="Enter spouse full name"
                  type="text"
                />
                <FormInput
                  label="Spouse Phone Number"
                  icon={<Phone className="w-full h-full" />}
                  iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
                  iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
                  value={formData.spousePhone || ""}
                  onChange={(value) => onChange("spousePhone", value)}
                  placeholder="+234 XXX XXX XXXX"
                  type="text"
                />
              </div>
            </div>

            {/* Dependents Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/20 midnight:bg-indigo-900/20 purple:bg-indigo-900/20 flex items-center justify-center flex-shrink-0">
                    <Baby className="w-4 h-4 text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400" />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white midnight:text-cyan-50 purple:text-pink-50">
                    Dependents (Children)
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={addDependent}
                  className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 midnight:text-indigo-300 purple:text-indigo-300 rounded-lg hover:bg-indigo-200 dark:hover:bg-indigo-900/40 midnight:hover:bg-indigo-900/40 purple:hover:bg-indigo-900/40 transition-colors text-sm font-medium"
                >
                  <Plus className="w-4 h-4" />
                  Add Dependent
                </button>
              </div>

              {dependents.length === 0 ? (
                <div className="pl-2 py-8 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 midnight:border-cyan-500/30 purple:border-pink-500/30 rounded-lg">
                  <Baby className="w-12 h-12 mx-auto mb-3 text-gray-400 dark:text-gray-600" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70">
                    No dependents added yet
                  </p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 midnight:text-cyan-400/50 purple:text-pink-400/50 mt-1">
                    Click &quot;Add Dependent&quot; to add children information
                  </p>
                </div>
              ) : (
                <div className="space-y-4 pl-2">
                  {dependents.map((dependent, index) => (
                    <div
                      key={dependent.id}
                      className="p-4 bg-gray-50 dark:bg-gray-800/50 midnight:bg-gray-900/50 purple:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700 midnight:border-cyan-500/20 purple:border-pink-500/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300">
                          Dependent {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeDependent(dependent.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-4">
                        <FormInput
                          label="Name"
                          icon={<User className="w-full h-full" />}
                          iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
                          iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
                          value={dependent.name}
                          onChange={(value) =>
                            updateDependent(dependent.id, "name", value)
                          }
                          placeholder="Enter child's name"
                          type="text"
                        />
                        <FormInput
                          label="Age"
                          icon={<Baby className="w-full h-full" />}
                          iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
                          iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
                          value={dependent.age}
                          onChange={(value) =>
                            updateDependent(dependent.id, "age", value)
                          }
                          placeholder="Enter age"
                          type="number"
                        />
                        <FormInput
                          label="School"
                          icon={<User className="w-full h-full" />}
                          iconBgColor="bg-indigo-100 dark:bg-indigo-900/30 midnight:bg-indigo-900/30 purple:bg-indigo-900/30"
                          iconColor="text-indigo-600 dark:text-indigo-400 midnight:text-indigo-400 purple:text-indigo-400"
                          value={dependent.school}
                          onChange={(value) =>
                            updateDependent(dependent.id, "school", value)
                          }
                          placeholder="Enter school name"
                          type="text"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
