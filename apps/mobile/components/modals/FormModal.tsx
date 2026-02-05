import { type ReactNode, useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useIsTablet } from '../../hooks/useIsTablet';
import { Modal } from '../ui/Modal';
import { FormDropdown, type FormDropdownOption } from '../ui/FormDropdown';
import { FormTextarea } from '../ui/FormTextarea';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// ============================================================================
// Types
// ============================================================================

export type FormFieldType = 'text' | 'number' | 'email' | 'tel' | 'dropdown' | 'textarea' | 'custom';

/** Field configuration */
export interface FormFieldConfig {
  id: string;
  label: string;
  type: FormFieldType;
  icon?: ReactNode;
  iconBgColor?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Dropdown options */
  options?: FormDropdownOption[];
  /** Textarea rows */
  rows?: number;
  maxLength?: number;
  showCharCount?: boolean;
  /** Number constraints */
  min?: number;
  max?: number;
  /** Custom render */
  render?: (value: string, onChange: (value: string) => void, error?: string) => ReactNode;
  /** Validation */
  validate?: (value: string, allValues: Record<string, string>) => string | undefined;
  /** Conditional display */
  condition?: (values: Record<string, string>) => boolean;
}

/** Section grouping */
export interface FormSectionConfig {
  id: string;
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
}

export interface FormModalProps {
  /** Preferred visibility prop (web-aligned) */
  isOpen?: boolean;
  /** Back-compat visibility prop */
  visible?: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  iconBgColors?: readonly [string, string];
  /** Sections mode */
  sections?: FormSectionConfig[];
  /** Flat fields mode */
  fields?: FormFieldConfig[];
  /** Initial values */
  initialValues?: Record<string, string>;
  /** Controlled values */
  values?: Record<string, string>;
  onChange?: (values: Record<string, string>) => void;
  onSubmit?: (values: Record<string, string>) => void | Promise<void>;
  submitLabel?: string;
  cancelLabel?: string;
  isSubmitting?: boolean;
  /** Info banner at top */
  infoBanner?: ReactNode;
}

// ============================================================================
// Component
// ============================================================================

export function FormModal({
  isOpen,
  visible,
  onClose,
  title,
  subtitle,
  icon,
  iconBgColors,
  sections,
  fields,
  initialValues = {},
  values: controlledValues,
  onChange,
  onSubmit,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  isSubmitting = false,
  infoBanner,
}: FormModalProps) {
  const { colors } = useTheme();
  const isTablet = useIsTablet();
  const scrollRef = useRef<ScrollViewType>(null);
  const resolvedVisible = isOpen ?? visible ?? false;

  const [internalValues, setInternalValues] = useState<Record<string, string>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formValues = controlledValues ?? internalValues;

  // Reset on open
  useEffect(() => {
    if (resolvedVisible) {
      setInternalValues(initialValues);
      setErrors({});
    }
  }, [resolvedVisible, initialValues]);

  const handleFieldChange = useCallback(
    (fieldId: string, value: string) => {
      const newValues = { ...formValues, [fieldId]: value };
      if (!controlledValues) {
        setInternalValues(newValues);
      }
      onChange?.(newValues);
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

  const allFields = sections ? sections.flatMap((s) => s.fields) : fields ?? [];

  const validateAll = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    for (const field of allFields) {
      if (field.condition && !field.condition(formValues)) continue;
      const value = formValues[field.id] ?? '';
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
    if (field.condition && !field.condition(formValues)) return null;

    const value = formValues[field.id] ?? '';
    const error = errors[field.id];

    switch (field.type) {
      case 'dropdown':
        return (
          <View key={field.id} style={styles.fieldWrapper}>
            <FormDropdown
              label={field.label}
              icon={field.icon || <Ionicons name="chevron-down" size={16} color={colors.textMuted} />}
              iconBgColor={field.iconBgColor}
              value={value}
              onChange={(v) => handleFieldChange(field.id, v)}
              options={field.options ?? []}
              placeholder={field.placeholder}
              disabled={field.disabled}
              required={field.required}
              error={error}
              parentScrollRef={scrollRef}
            />
          </View>
        );

      case 'textarea':
        return (
          <View key={field.id} style={styles.fieldWrapper}>
            <FormTextarea
              label={field.label}
              icon={field.icon || <Ionicons name="document-text-outline" size={16} color={colors.textMuted} />}
              iconBgColor={field.iconBgColor}
              value={value}
              onChangeText={(v) => handleFieldChange(field.id, v)}
              placeholder={field.placeholder}
              rows={field.rows}
              required={field.required}
              error={error}
              maxLength={field.maxLength}
              showCharCount={field.showCharCount}
            />
          </View>
        );

      case 'custom':
        return (
          <View key={field.id} style={styles.fieldWrapper}>
            {field.render?.(value, (v) => handleFieldChange(field.id, v), error)}
          </View>
        );

      default: {
        // Text/number/email/tel input
        const keyboardType =
          field.type === 'number' ? 'numeric' as const :
          field.type === 'email' ? 'email-address' as const :
          field.type === 'tel' ? 'phone-pad' as const :
          'default' as const;

        return (
          <View key={field.id} style={styles.fieldWrapper}>
            {/* Label */}
            <View style={styles.labelRow}>
              {field.icon && (
                <View style={[styles.labelIcon, { backgroundColor: field.iconBgColor || colors.primaryLight }]}>
                  {field.icon}
                </View>
              )}
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                {field.label}
                {field.required && <Text style={{ color: colors.error }}> *</Text>}
              </Text>
            </View>

            {/* Input */}
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: error ? colors.error : colors.inputBorder,
                  color: colors.text,
                  paddingVertical: isTablet ? 14 : 12,
                },
                field.disabled && { opacity: 0.5 },
              ]}
              value={value}
              onChangeText={(v) => handleFieldChange(field.id, v)}
              placeholder={field.placeholder}
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType={keyboardType}
              editable={!field.disabled}
              autoCapitalize={field.type === 'email' ? 'none' : 'sentences'}
            />

            {/* Error */}
            {error && (
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            )}
          </View>
        );
      }
    }
  };

  // Footer
  const footer = (
    <View style={styles.footerButtons}>
      <Pressable
        onPress={onClose}
        style={[styles.cancelButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
      >
        <Text style={[styles.cancelButtonText, { color: colors.textSecondary }]}>{cancelLabel}</Text>
      </Pressable>
      <Pressable
        onPress={handleSubmit}
        disabled={isSubmitting}
        style={[
          styles.submitButton,
          { backgroundColor: colors.primary },
          isSubmitting && { opacity: 0.6 },
        ]}
      >
        {isSubmitting && (
          <View style={styles.spinner} />
        )}
        <Text style={styles.submitButtonText}>{submitLabel}</Text>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={resolvedVisible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      icon={icon}
      iconBgColors={iconBgColors}
      footer={footer}
      scrollRef={scrollRef}
    >
      {/* Info banner */}
      {infoBanner}

      {/* Sections mode */}
      {sections?.map((section) => (
        <View key={section.id} style={styles.section}>
          {section.title && (
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>
              {section.title}
            </Text>
          )}
          {section.description && (
            <Text style={[styles.sectionDescription, { color: colors.textTertiary }]}>
              {section.description}
            </Text>
          )}
          {section.fields.map(renderField)}
        </View>
      ))}

      {/* Flat fields mode */}
      {!sections && fields?.map(renderField)}
    </Modal>
  );
}

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 12,
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  labelIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: FONTS.regular,
  },
  errorText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 4,
    marginLeft: 4,
  },

  // Footer
  footerButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
  spinner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: '#ffffff',
  },
});

export default FormModal;
