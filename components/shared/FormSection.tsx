"use client";

import { useState, useId, type ReactNode } from "react";
import { ChevronDown, type LucideIcon } from "lucide-react";
import FormInput from "./FormInput";
import FormDropdown from "./FormDropdown";
import FormTextarea from "./FormTextarea";
import type { FormFieldConfig } from "@/types/components";

export interface FormSectionProps {
  /** Section title */
  title: string;
  /** Section description */
  description?: string;
  /** Section icon */
  icon?: LucideIcon;
  /** Form field configurations */
  fields?: FormFieldConfig[];
  /** Form values */
  values?: Record<string, unknown>;
  /** Form errors */
  errors?: Record<string, string>;
  /** Callback when field value changes */
  onChange?: (field: string, value: unknown) => void;
  /** Whether the section is collapsible */
  collapsible?: boolean;
  /** Whether the section is expanded by default */
  defaultExpanded?: boolean;
  /** Controlled expanded state */
  expanded?: boolean;
  /** Callback when expanded state changes */
  onExpandedChange?: (expanded: boolean) => void;
  /** Custom content (instead of using fields) */
  children?: ReactNode;
  /** Additional className for the section */
  className?: string;
  /** Additional className for the content */
  contentClassName?: string;
  /** Icon color variant */
  iconColor?: "blue" | "green" | "purple" | "orange" | "red" | "gray";
}

// Icon color classes
const iconColors = {
  blue: "bg-blue-100 dark:bg-blue-900/30 midnight:bg-cyan-900/30 purple:bg-pink-900/30 text-blue-600 dark:text-blue-400 midnight:text-cyan-400 purple:text-pink-400",
  green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 midnight:text-emerald-400 purple:text-emerald-400",
  purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  orange: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
  red: "bg-red-100 dark:bg-red-900/30 midnight:bg-red-900/30 purple:bg-red-900/30 text-red-600 dark:text-red-400 midnight:text-red-400 purple:text-red-400",
  gray: "bg-gray-100 dark:bg-[#22262e] midnight:bg-[#0f1330] purple:bg-[#251340] text-gray-600 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300",
};

// Field width classes
const fieldWidths = {
  full: "col-span-2",
  half: "col-span-2 sm:col-span-1",
  third: "col-span-2 sm:col-span-1 lg:col-span-1",
  quarter: "col-span-2 sm:col-span-1 lg:col-span-1 xl:col-span-1",
};

/**
 * Reusable form section component with collapsible functionality
 * Supports both configured fields and custom children content
 * Fully responsive for all screen sizes
 *
 * @example
 * ```tsx
 * <FormSection
 *   title="Personal Information"
 *   description="Basic details about the parent"
 *   icon={User}
 *   fields={[
 *     { id: "firstName", type: "text", label: "First Name", required: true, width: "half" },
 *     { id: "lastName", type: "text", label: "Last Name", required: true, width: "half" },
 *     { id: "email", type: "email", label: "Email", required: true },
 *   ]}
 *   values={formData}
 *   errors={formErrors}
 *   onChange={(field, value) => setFormData({ ...formData, [field]: value })}
 *   collapsible
 *   defaultExpanded
 * />
 * ```
 */
export default function FormSection({
  title,
  description,
  icon: Icon,
  fields,
  values = {},
  errors = {},
  onChange,
  collapsible = true,
  defaultExpanded = true,
  expanded: controlledExpanded,
  onExpandedChange,
  children,
  className = "",
  contentClassName = "",
  iconColor = "blue",
}: FormSectionProps) {
  const sectionId = useId();
  const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);

  // Use controlled or uncontrolled state
  const isExpanded = controlledExpanded !== undefined ? controlledExpanded : internalExpanded;
  const setIsExpanded = (value: boolean) => {
    if (controlledExpanded === undefined) {
      setInternalExpanded(value);
    }
    onExpandedChange?.(value);
  };

  // Toggle expand
  const handleToggle = () => {
    if (collapsible) {
      setIsExpanded(!isExpanded);
    }
  };

  // Render a single field
  const renderField = (field: FormFieldConfig) => {
    const value = values[field.id];
    const error = errors[field.id];
    const widthClass = fieldWidths[field.width || "full"];

    // Check dependency condition
    if (field.dependsOn) {
      const dependValue = values[field.dependsOn.field];
      const targetValues = Array.isArray(field.dependsOn.value)
        ? field.dependsOn.value
        : [field.dependsOn.value];
      if (!targetValues.includes(dependValue as string)) {
        return null;
      }
    }

    switch (field.type) {
      case "select":
        return (
          <div key={field.id} className={widthClass}>
            <FormDropdown
              label={field.label}
              value={(value as string) || ""}
              onChange={(val) => onChange?.(field.id, val)}
              options={
                field.options?.map((opt) =>
                  typeof opt === "string" ? { value: opt, label: opt } : opt
                ) || []
              }
              required={field.required}
              error={error}
              placeholder={field.placeholder || `Select ${field.label.toLowerCase()}`}
            />
          </div>
        );

      case "textarea":
        return (
          <div key={field.id} className={widthClass}>
            <FormTextarea
              label={field.label}
              value={(value as string) || ""}
              onChange={(val) => onChange?.(field.id, val)}
              placeholder={field.placeholder}
              required={field.required}
              error={error}
              rows={field.validation?.max ? Math.min(field.validation.max / 50, 6) : 3}
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={field.id} className={widthClass}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => onChange?.(field.id, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300 midnight:text-cyan-200 purple:text-pink-200">{field.label}</span>
            </label>
            {field.helpText && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{field.helpText}</p>
            )}
          </div>
        );

      default:
        return (
          <div key={field.id} className={widthClass}>
            <FormInput
              label={field.label}
              type={field.type as "text" | "email" | "tel" | "number" | "date"}
              value={(value as string) || ""}
              onChange={(val) => onChange?.(field.id, val)}
              placeholder={field.placeholder}
              required={field.required}
              error={error}
              min={field.validation?.min}
              max={field.validation?.max}
              minLength={field.validation?.minLength}
              maxLength={field.validation?.maxLength}
            />
            {field.helpText && !error && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">{field.helpText}</p>
            )}
          </div>
        );
    }
  };

  return (
    <section
      className={`
        bg-white dark:bg-[#1a1d24] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e]
        rounded-xl border border-gray-200 dark:border-gray-700
        midnight:border-cyan-700/30 purple:border-pink-700/30
        overflow-hidden transition-all duration-200
        ${className}
      `}
    >
      {/* Header */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={!collapsible}
        className={`
          w-full flex items-center gap-3 px-4 sm:px-6 py-4
          ${collapsible ? "cursor-pointer hover:bg-gray-50 dark:hover:bg-[#22262e] midnight:hover:bg-cyan-500/10 purple:hover:bg-pink-500/10" : "cursor-default"}
          transition-colors
        `}
        aria-expanded={isExpanded}
        aria-controls={`${sectionId}-content`}
      >
        {/* Icon */}
        {Icon && (
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[iconColor]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {/* Title & Description */}
        <div className="flex-1 text-left min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white midnight:text-cyan-100 purple:text-pink-100">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300 truncate">
              {description}
            </p>
          )}
        </div>

        {/* Expand/Collapse Icon */}
        {collapsible && (
          <ChevronDown
            className={`
              w-5 h-5 text-gray-400 dark:text-gray-500 midnight:text-cyan-400 purple:text-pink-400 flex-shrink-0
              transition-transform duration-200
              ${isExpanded ? "rotate-180" : ""}
            `}
          />
        )}
      </button>

      {/* Content */}
      <div
        id={`${sectionId}-content`}
        className={`
          grid transition-[grid-template-rows] duration-200 ease-out
          ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
        `}
      >
        <div className="overflow-hidden">
          <div className={`px-4 sm:px-6 pb-6 ${contentClassName}`}>
            {/* Divider */}
            <div className="border-t border-gray-200 dark:border-gray-700 midnight:border-cyan-700/30 purple:border-pink-700/30 mb-4" />

            {/* Render fields or children */}
            {children ? (
              children
            ) : fields && fields.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {fields.map(renderField)}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 midnight:text-cyan-300 purple:text-pink-300">No fields configured</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
