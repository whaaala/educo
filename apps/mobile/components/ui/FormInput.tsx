import type { ReactNode } from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Shared fonts and colors
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

const COLORS = {
  white: '#ffffff',
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  blue50: '#eff6ff',
  blue100: '#dbeafe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  red400: '#f87171',
  red500: '#ef4444',
};

export interface FormInputProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  iconColor?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  keyboardType?: TextInputProps['keyboardType'];
  secureTextEntry?: boolean;
  leftIcon?: ReactNode;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  multiline?: boolean;
  numberOfLines?: number;
}

export function FormInput({
  label,
  icon,
  iconBgColor = COLORS.blue100,
  iconColor = COLORS.blue600,
  value,
  onChangeText,
  placeholder = '',
  keyboardType = 'default',
  secureTextEntry = false,
  leftIcon,
  disabled = false,
  required = false,
  error,
  multiline = false,
  numberOfLines = 1,
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  return (
    <View style={styles.container}>
      {/* Label */}
      <View style={styles.labelRow}>
        <View style={[styles.labelIcon, { backgroundColor: iconBgColor }]}>
          {icon}
        </View>
        <Text style={styles.label}>{label}</Text>
        {required && <Text style={styles.required}>*</Text>}
      </View>

      {/* Input */}
      <Pressable
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          disabled && styles.inputContainerDisabled,
        ]}
        onPress={() => inputRef.current?.focus()}
      >
        {leftIcon && <View style={styles.leftIconContainer}>{leftIcon}</View>}
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            leftIcon && styles.inputWithLeftIcon,
            multiline && styles.inputMultiline,
            disabled && styles.inputDisabled,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.slate400}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          editable={!disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={multiline}
          numberOfLines={numberOfLines}
        />
      </Pressable>

      {/* Error */}
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={COLORS.red500} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.slate700,
  },
  required: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.red500,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    borderRadius: 14,
    minHeight: 50,
    paddingHorizontal: 16,
  },
  inputContainerFocused: {
    borderColor: COLORS.blue500,
    backgroundColor: COLORS.blue50,
  },
  inputContainerError: {
    borderColor: COLORS.red400,
    backgroundColor: '#fef2f2',
  },
  inputContainerDisabled: {
    backgroundColor: COLORS.slate100,
    opacity: 0.7,
  },
  leftIconContainer: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.slate900,
    paddingVertical: 12,
  },
  inputWithLeftIcon: {
    paddingLeft: 0,
  },
  inputMultiline: {
    textAlignVertical: 'top',
    paddingTop: 14,
    paddingBottom: 14,
  },
  inputDisabled: {
    color: COLORS.slate500,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.red500,
    marginLeft: 6,
  },
});

export default FormInput;
