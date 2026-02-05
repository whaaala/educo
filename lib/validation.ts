import { getFieldLabel } from "./fieldLabels";

export interface ValidationErrors {
  [key: string]: string;
}

export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any, formData?: any) => string | null;
  email?: boolean;
  phone?: boolean;
  date?: boolean;
}

export interface ValidationRules {
  [fieldName: string]: ValidationRule;
}

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation regex (supports international formats)
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

// Date validation (YYYY-MM-DD format)
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

export function validateField(
  fieldName: string,
  value: any,
  rules: ValidationRule
): string | null {
  const fieldLabel = getFieldLabel(fieldName);
  
  // Required validation
  if (rules.required) {
    // For checkboxes (boolean), check if false
    if (typeof value === "boolean") {
      if (!value) {
        return `${fieldLabel} is required`;
      }
    }
    // For arrays
    else if (Array.isArray(value) && value.length === 0) {
      return `${fieldLabel} is required`;
    }
    // For other types
    else if (value === null || value === undefined || value === "") {
      return `${fieldLabel} is required`;
    }
  }

  // Skip other validations if field is empty and not required (except for booleans)
  if (typeof value !== "boolean" && (!value || value === "")) {
    return null;
  }

  const stringValue = String(value).trim();

  // Email validation
  if (rules.email && stringValue && !EMAIL_REGEX.test(stringValue)) {
    return `Please enter a valid email address`;
  }

  // Phone validation
  if (rules.phone && stringValue && !PHONE_REGEX.test(stringValue)) {
    return `Please enter a valid phone number`;
  }

  // Date validation
  if (rules.date && stringValue && !DATE_REGEX.test(stringValue)) {
    return `Please enter a valid date`;
  }

  // Min length validation
  if (rules.minLength && stringValue.length < rules.minLength) {
    return `${fieldLabel} must be at least ${rules.minLength} characters`;
  }

  // Max length validation
  if (rules.maxLength && stringValue.length > rules.maxLength) {
    return `${fieldLabel} must be no more than ${rules.maxLength} characters`;
  }

  // Pattern validation
  if (rules.pattern && stringValue && !rules.pattern.test(stringValue)) {
    return `Please enter a valid ${fieldLabel}`;
  }

  // Custom validation - handled separately in validateForm
  // (custom validation may need access to entire formData)

  return null;
}

export function validateForm(
  formData: Record<string, any>,
  validationRules: ValidationRules
): ValidationErrors {
  const errors: ValidationErrors = {};

  for (const fieldName in validationRules) {
    // Skip custom validation fields that start with underscore
    if (fieldName.startsWith('_')) {
      const rule = validationRules[fieldName];
      if (rule.custom) {
        // Pass formData to custom validation for cross-field validation
        const error = rule.custom(null, formData);
        if (error) {
          // For cross-field validations, add error to the first related field
          if (fieldName === '_parentGuardianValidation') {
            if (!formData.guardianFirstName || !formData.guardianLastName || !formData.guardianEmail || !formData.guardianPhone) {
              errors.guardianFirstName = error;
            } else if (!formData.fatherFirstName || !formData.fatherLastName || !formData.fatherEmail || !formData.fatherPhone) {
              errors.fatherFirstName = error;
            } else {
              errors.motherFirstName = error;
            }
          }
        }
      }
      continue;
    }

    const rule = validationRules[fieldName];
    const value = formData[fieldName];
    const error = validateField(fieldName, value, rule);
    if (error) {
      errors[fieldName] = error;
    }
  }

  return errors;
}


