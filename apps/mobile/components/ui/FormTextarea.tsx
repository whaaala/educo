import type { ReactNode } from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export interface FormTextareaProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  rows?: number;
  optional?: boolean;
  required?: boolean;
  error?: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export function FormTextarea({
  label,
  icon,
  iconBgColor,
  value,
  onChangeText,
  placeholder = '',
  rows = 4,
  optional = false,
  required = false,
  error,
  maxLength,
  showCharCount = false,
}: FormTextareaProps) {
  const { colors } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  // Calculate minimum height based on rows
  const minHeight = rows * 24 + 28; // 24px per row + padding

  const actualIconBgColor = iconBgColor || colors.primaryLight;

  return (
    <View style={styles.container}>
      {/* Label */}
      <View style={styles.labelRow}>
        <View style={[styles.labelIcon, { backgroundColor: actualIconBgColor }]}>
          {icon}
        </View>
        <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
        {required && <Text style={[styles.required, { color: colors.error }]}>*</Text>}
        {optional && !required && <Text style={[styles.optional, { color: colors.textMuted }]}>(Optional)</Text>}
      </View>

      {/* Input */}
      <Pressable
        style={[
          styles.inputContainer,
          {
            minHeight,
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.error : (isFocused ? colors.inputBorderFocus : colors.inputBorder),
          },
          isFocused && { backgroundColor: colors.primaryLight },
          error && { backgroundColor: colors.errorLight },
        ]}
        onPress={() => inputRef.current?.focus()}
      >
        <TextInput
          ref={inputRef}
          style={[styles.input, { minHeight: minHeight - 28, color: colors.text }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          multiline
          textAlignVertical="top"
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          maxLength={maxLength}
        />
      </Pressable>

      {/* Bottom Row: Error or Character Count */}
      <View style={styles.bottomRow}>
        {error ? (
          <View style={styles.errorRow}>
            <Ionicons name="alert-circle" size={14} color={colors.error} />
            <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          </View>
        ) : (
          <View />
        )}
        {showCharCount && maxLength && (
          <Text style={[styles.charCount, { color: colors.textMuted }]}>
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
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
  },
  required: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    marginLeft: 4,
  },
  optional: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginLeft: 8,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  input: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginLeft: 6,
  },
  charCount: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
});

export default FormTextarea;
