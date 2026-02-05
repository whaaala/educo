"use client";

import { type ReactNode, useState, useCallback, useEffect } from "react";
import { type LucideIcon } from "lucide-react";
import Modal from "./Modal";
import Button from "./Button";
import FormInput from "./FormInput";
import FormDropdown from "./FormDropdown";
import FormTextarea from "./FormTextarea";

// ============================================================================
// Types
// ============================================================================

/** Field types supported by the form modal */
export type FormFieldType =
  | "text"
  | "number"
  | "email"
  | "tel"
  | "date"
  | "time"
  | "dropdown"
  | "textarea"
  | "custom";

/** Dropdown option */
export interface FormFieldOption {
  value: string;
  label: string;
}

/** Individual form field configuration */
export interface FormFieldConfig {
  id: string;
  label: string;
  type: FormFieldType;
  icon?: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  /** Full width (spans both columns in 2-col layout) */
  fullWidth?: boolean;
  /** Dropdown options (for type: "dropdown") */
  options?: FormFieldOption[];
  /** Textarea rows (for type: "textarea") */
  rows?: number;
  /** Max length for textarea */
  maxLength?: number;
  /** Show character count for textarea */
  showCharacterCount?: boolean;
  /** Number input constraints */
  min?: number;
  max?: number;
  step?: number;
  /** Help text below the field */
  helpText?: ReactNode;
  /** Custom render function (for type: "custom") */
  render?: (value: string, onChange: (value: string) => void, error?: string) => ReactNode;
  /** Validation function - return error string or undefined */
  validate?: (value: string, allValues: Record<string, string>) => string | undefined;
  /** Only show if condition is true */
  condition?: (values: Record<string, string>) => boolean;
}

/** Form section for grouping fields */
export interface FormSectionConfig {
  id: string;
  title?: string;
  description?: string;
  /** Layout for fields in this section */
  columns?: 1 | 2;
  fields: FormFieldConfig[];
}

/** Footer action button */
export interface FormAction {
  id: string;
  label: string;
  icon?: LucideIcon;
  variant: "primary" | "secondary" | "ghost" | "danger";
  type?: "submit" | "button";
  position?: "left" | "right";
  onClick?: () => void;
  /** Show loading spinner */
  loading?: boolean;
  disabled?: boolean;
}

export interface FormModalProps {
  /** Preferred visibility prop */
  isOpen?: boolean;
  /** Back-compat visibility prop (mobile-aligned) */
  visible?: boolean;
  onClose: () => void;
  /** Modal title */
  title: string;
  /** Modal subtitle */
  subtitle?: string;
  /** Modal icon */
  icon?: ReactNode;
  /** Modal size */
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";
  /** Form sections (grouped fields) */
  sections?: FormSectionConfig[];
  /** Flat field list (alternative to sections) */
  fields?: FormFieldConfig[];
  /** Default column layout when using flat fields */
  columns?: 1 | 2;
  /** Initial form values */
  initialValues?: Record<string, string>;
  /** Controlled form values */
  values?: Record<string, string>;
  /** Callback when form values change */
  onChange?: (values: Record<string, string>) => void;
  /** Callback when form is submitted */
  onSubmit?: (values: Record<string, string>) => void | Promise<void>;
  /** Footer actions (overrides default submit/cancel) */
  actions?: FormAction[];
  /** Submit button label (default: "Save") */
  submitLabel?: string;
  /** Cancel button label (default: "Cancel") */
  cancelLabel?: string;
  /** Show loading on submit button */
  isSubmitting?: boolean;
  /** Info banner at top of form */
  infoBanner?: ReactNode;
  /** Custom content above footer */
  footerContent?: ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export default function FormModal({
  isOpen,
  visible,
  onClose,
  title,
  subtitle,
  icon,
  size = "2xl",
  sections,
  fields,
  columns = 1,
  initialValues = {},
  values: controlledValues,
  onChange,
  onSubmit,
  actions,
  submitLabel = "Save",
  cancelLabel = "Cancel",
  isSubmitting = false,
  infoBanner,
  footerContent,
}: FormModalProps) {
  const resolvedIsOpen = isOpen ?? visible ?? false;
  // Internal form state
  const [internalValues, setInternalValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formValues = controlledValues ?? internalValues;

  // Reset form when modal opens
  useEffect(() => {
    if (resolvedIsOpen) {
      setInternalValues(initialValues);
      setErrors({});
    }
  }, [resolvedIsOpen, initialValues]);

  const handleFieldChange = useCallback(
    (fieldId: string, value: string) => {
      const newValues = { ...formValues, [fieldId]: value };
      if (!controlledValues) {
        setInternalValues(newValues);
      }
      onChange?.(newValues);
      // Clear error on change
      if (errors[fieldId]) {
        setErrors((prev) => {
          const next = { ...prev };
          delete next[fieldId];
          return next;
        });
      }
    },
    [formValues, controlledValues, onChange, errors]
  );

  // Collect all fields from sections or flat list
  const allFields = sections
    ? sections.flatMap((s) => s.fields)
    : fields ?? [];

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};

    for (const field of allFields) {
      // Skip hidden fields
      if (field.condition && !field.condition(formValues)) continue;

      const value = formValues[field.id] ?? "";

      if (field.required && !value.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      } else if (field.validate) {
        const error = field.validate(value, formValues);
        if (error) newErrors[field.id] = error;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [allFields, formValues]);

  const handleSubmit = useCallback(async () => {
    if (!validateAll()) return;
    await onSubmit?.(formValues);
  }, [validateAll, onSubmit, formValues]);

  // Render a single field
  const renderField = (field: FormFieldConfig) => {
    // Check condition
    if (field.condition && !field.condition(formValues)) return null;

    const value = formValues[field.id] ?? "";
    const error = errors[field.id];

    switch (field.type) {
      case "dropdown":
        return (
          <FormDropdown
            key={field.id}
            label={field.label}
            icon={field.icon}
            iconBgColor={field.iconBgColor}
            iconColor={field.iconColor}
            value={value}
            onChange={(v) => handleFieldChange(field.id, v)}
            options={field.options ?? []}
            placeholder={field.placeholder}
            disabled={field.disabled}
            required={field.required}
            error={error}
            helpText={typeof field.helpText === "string" ? field.helpText : undefined}
          />
        );

      case "textarea":
        return (
          <FormTextarea
            key={field.id}
            label={field.label}
            icon={field.icon}
            iconBgColor={field.iconBgColor}
            iconColor={field.iconColor}
            value={value}
            onChange={(v) => handleFieldChange(field.id, v)}
            placeholder={field.placeholder}
            rows={field.rows}
            required={field.required}
            error={error}
            maxLength={field.maxLength}
            showCharacterCount={field.showCharacterCount}
          />
        );

      case "custom":
        return field.render?.(value, (v) => handleFieldChange(field.id, v), error) ?? null;

      default:
        return (
          <FormInput
            key={field.id}
            label={field.label}
            icon={field.icon}
            iconBgColor={field.iconBgColor}
            iconColor={field.iconColor}
            value={value}
            onChange={(v) => handleFieldChange(field.id, v)}
            placeholder={field.placeholder}
            type={field.type as "text" | "number" | "email" | "date" | "time" | "tel"}
            disabled={field.disabled}
            required={field.required}
            error={error}
            min={field.min}
            max={field.max}
            step={field.step}
            helpText={field.helpText}
          />
        );
    }
  };

  // Render fields in a grid
  const renderFieldGrid = (fieldList: FormFieldConfig[], cols: 1 | 2 = 1) => (
    <div className={`grid ${cols === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"} gap-4`}>
      {fieldList.map((field) => {
        if (field.condition && !field.condition(formValues)) return null;
        return (
          <div key={field.id} className={field.fullWidth ? "col-span-full" : ""}>
            {renderField(field)}
          </div>
        );
      })}
    </div>
  );

  // Build footer
  const leftActions = actions?.filter((a) => a.position === "left") ?? [];
  const rightActions = actions?.filter((a) => a.position === "right" || !a.position) ?? [];

  const footer = actions ? (
    <div className="flex justify-between w-full">
      <div className="flex gap-2">
        {leftActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={action.type === "submit" ? handleSubmit : action.onClick}
            disabled={action.disabled || action.loading}
          >
            {action.loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              action.icon && <action.icon className="w-4 h-4 mr-2" />
            )}
            {action.label}
          </Button>
        ))}
      </div>
      <div className="flex gap-2">
        {rightActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            onClick={action.type === "submit" ? handleSubmit : action.onClick}
            disabled={action.disabled || action.loading}
          >
            {action.loading ? (
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
            ) : (
              action.icon && <action.icon className="w-4 h-4 mr-2" />
            )}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  ) : (
    <div className="flex justify-end gap-2 w-full">
      <Button variant="ghost" onClick={onClose}>
        {cancelLabel}
      </Button>
      <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting && (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
        )}
        {submitLabel}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={resolvedIsOpen}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={icon}
      maxWidth={size}
      footer={footer}
    >
      <div className="space-y-6">
        {/* Info Banner */}
        {infoBanner}

        {/* Sections mode */}
        {sections?.map((section) => (
          <div key={section.id}>
            {section.title && (
              <h4 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">
                {section.title}
              </h4>
            )}
            {section.description && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                {section.description}
              </p>
            )}
            {renderFieldGrid(section.fields, section.columns)}
          </div>
        ))}

        {/* Flat fields mode */}
        {!sections && fields && renderFieldGrid(fields, columns)}

        {/* Footer content */}
        {footerContent}
      </div>
    </Modal>
  );
}
