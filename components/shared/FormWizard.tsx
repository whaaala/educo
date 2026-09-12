"use client";

import { ReactNode } from "react";
import { Check } from "lucide-react";

export interface FormStep {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}

interface FormWizardProps {
  steps: FormStep[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  children: ReactNode;
  allowStepNavigation?: boolean;
}

export default function FormWizard({
  steps,
  currentStep,
  onStepClick,
  children,
  allowStepNavigation = false,
}: FormWizardProps) {
  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed";
    if (stepIndex === currentStep) return "current";
    return "upcoming";
  };

  return (
    <div className="space-y-6">
      {/* Steps Navigation */}
      <nav aria-label="Progress" className="mb-8">
        <ol className="flex items-center">
          {steps.map((step, index) => {
            const status = getStepStatus(index);
            const isClickable = allowStepNavigation && index <= currentStep && onStepClick;

            return (
              <li key={step.id} className="relative flex-1 flex items-center">
                {/* Connector Line - Before the step */}
                {index !== 0 && (
                  <div className="flex-1 h-0.5 mx-2">
                    <div
                      className={`h-full transition-all duration-300 ${
                        index <= currentStep
                          ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500"
                          : "bg-gray-300 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
                      }`}
                    />
                  </div>
                )}

                {/* Step Button */}
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(index)}
                  disabled={!isClickable}
                  className={`flex flex-col items-center group flex-shrink-0 ${
                    isClickable ? "cursor-pointer" : "cursor-default"
                  }`}
                >
                  {/* Step Circle */}
                  <span
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      status === "completed"
                        ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-600 purple:bg-pink-600 border-blue-600 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500"
                        : status === "current"
                        ? "bg-surface border-blue-600 dark:border-blue-500 midnight:border-cyan-500 purple:border-pink-500 ring-4 ring-blue-100 dark:ring-blue-900/30 midnight:ring-cyan-900/30 purple:ring-pink-900/30"
                        : "bg-surface border-gray-300 dark:border-gray-600 midnight:border-gray-700 purple:border-gray-700"
                    } ${isClickable && status !== "current" ? "group-hover:border-blue-400 dark:group-hover:border-blue-400" : ""}`}
                  >
                    {status === "completed" ? (
                      <Check className="w-5 h-5 text-white" />
                    ) : (
                      <span
                        className={`text-sm font-semibold ${
                          status === "current"
                            ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                            : "text-gray-500 dark:text-gray-400 midnight:text-gray-500 purple:text-gray-500"
                        }`}
                      >
                        {index + 1}
                      </span>
                    )}
                  </span>

                  {/* Step Label */}
                  <span className="mt-2 text-center w-20">
                    <span
                      className={`block text-xs font-medium ${
                        status === "current"
                          ? "text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400"
                          : status === "completed"
                          ? "text-gray-900 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200"
                          : "text-gray-500 dark:text-gray-400 midnight:text-gray-500 purple:text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    {step.description && (
                      <span className="hidden md:block text-[0.625rem] text-gray-500 dark:text-gray-400 midnight:text-gray-500 purple:text-gray-500 mt-0.5">
                        {step.description}
                      </span>
                    )}
                  </span>
                </button>

                {/* Connector Line - After the step */}
                {index !== steps.length - 1 && (
                  <div className="flex-1 h-0.5 mx-2">
                    <div
                      className={`h-full transition-all duration-300 ${
                        index < currentStep
                          ? "bg-blue-600 dark:bg-blue-500 midnight:bg-cyan-500 purple:bg-pink-500"
                          : "bg-gray-300 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340]"
                      }`}
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step Content */}
      <div>{children}</div>
    </div>
  );
}

// Form Section Component
interface FormSectionProps {
  title: string;
  description?: string;
  children: ReactNode;
  icon?: ReactNode;
}

export function FormSection({ title, description, children, icon }: FormSectionProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 pb-3 border-b border-gray-200 dark:border-gray-700 midnight:border-cyan-800/30 purple:border-pink-800/30">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-ink">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

// Form Field Component
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
  fullWidth?: boolean;
}

export function FormField({ label, required, error, hint, children, fullWidth }: FormFieldProps) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 midnight:text-cyan-300 purple:text-pink-300 mb-1.5">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-400/70 purple:text-pink-400/70 mt-1.5">
          {hint}
        </p>
      )}
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400 mt-1.5 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
