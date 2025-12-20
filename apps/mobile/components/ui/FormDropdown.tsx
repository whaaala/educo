import type { ReactNode } from 'react';
import { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

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

export interface FormDropdownOption {
  value: string;
  label: string;
}

export interface FormDropdownProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  value: string;
  onChange: (value: string) => void;
  options: FormDropdownOption[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}

export function FormDropdown({
  label,
  icon,
  iconBgColor = COLORS.blue100,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error,
}: FormDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

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

      {/* Dropdown Button */}
      <Pressable
        style={[
          styles.dropdownButton,
          error && styles.dropdownButtonError,
          disabled && styles.dropdownButtonDisabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            !selectedOption && styles.dropdownButtonPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Ionicons
          name="chevron-down"
          size={20}
          color={COLORS.slate400}
        />
      </Pressable>

      {/* Error */}
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={COLORS.red500} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setIsOpen(false)}>
          <View style={styles.modalContent}>
            {/* Handle Bar */}
            <View style={styles.handleBarContainer}>
              <View style={styles.handleBar} />
            </View>

            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{label}</Text>
              <Pressable onPress={() => setIsOpen(false)} style={styles.modalCloseBtn}>
                <Ionicons name="close" size={22} color={COLORS.slate500} />
              </Pressable>
            </View>

            {/* Options List */}
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              contentContainerStyle={styles.optionsListContent}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <Pressable
                    style={[
                      styles.optionItem,
                      isSelected && styles.optionItemSelected,
                    ]}
                    onPress={() => handleSelect(item.value)}
                  >
                    <Text
                      style={[
                        styles.optionLabel,
                        isSelected && styles.optionLabelSelected,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={22} color={COLORS.blue600} />
                    )}
                  </Pressable>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
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
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    borderRadius: 14,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownButtonError: {
    borderColor: COLORS.red400,
    backgroundColor: '#fef2f2',
  },
  dropdownButtonDisabled: {
    backgroundColor: COLORS.slate100,
    opacity: 0.7,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.slate900,
    marginRight: 8,
  },
  dropdownButtonPlaceholder: {
    color: COLORS.slate400,
    fontStyle: 'italic',
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
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.7,
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.slate300,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.slate100,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.slate900,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.slate100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionsList: {
    maxHeight: SCREEN_HEIGHT * 0.5,
  },
  optionsListContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 2,
  },
  optionItemSelected: {
    backgroundColor: COLORS.blue50,
  },
  optionLabel: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.slate700,
    flex: 1,
  },
  optionLabelSelected: {
    fontFamily: FONTS.semiBold,
    color: COLORS.blue600,
  },
});

export default FormDropdown;
