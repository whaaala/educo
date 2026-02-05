import type { ReactNode, RefObject } from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
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
  parentScrollRef?: RefObject<ScrollViewType | null>;
}

export function FormDropdown({
  label,
  icon,
  iconBgColor,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  error,
  parentScrollRef,
}: FormDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { colors } = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const containerRef = useRef<View>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Calculate the estimated height of the options list
  const optionsHeight = Math.min(options.length * 48, 200); // 48px per option, max 200px

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isOpen, rotateAnim]);

  const scrollToDropdown = useCallback(() => {
    if (!parentScrollRef?.current || !containerRef.current) return;

    // Measure the container position relative to the scroll view
    containerRef.current.measureLayout(
      parentScrollRef.current as any,
      (x, y, width, height) => {
        // Always scroll to show the dropdown label/button at the top of the visible area
        // This ensures users can see what they're selecting from
        const targetScrollY = Math.max(0, y - 16); // 16px padding from top
        parentScrollRef.current?.scrollTo({
          y: targetScrollY,
          animated: true,
        });
      },
      () => {
        // Fallback: if measureLayout fails
        console.log('measureLayout failed');
      }
    );
  }, [parentScrollRef]);

  const handleToggle = () => {
    if (disabled) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const willOpen = !isOpen;
    setIsOpen(willOpen);

    // If opening, scroll to ensure dropdown options are visible
    if (willOpen) {
      // Small delay to let the layout animation start
      setTimeout(() => {
        scrollToDropdown();
      }, 50);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsOpen(false);
  };

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View ref={containerRef} style={styles.container}>
      {/* Label */}
      <View style={styles.labelRow}>
        <View style={[styles.labelIcon, { backgroundColor: iconBgColor || colors.primaryLight }]}>
          {icon}
        </View>
        <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
        {required && <Text style={[styles.required, { color: colors.error }]}>*</Text>}
      </View>

      {/* Dropdown Button */}
      <Pressable
        style={[
          styles.dropdownButton,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : isOpen ? colors.primary : colors.border,
            borderBottomLeftRadius: isOpen ? 0 : 14,
            borderBottomRightRadius: isOpen ? 0 : 14,
          },
          disabled && styles.dropdownButtonDisabled,
        ]}
        onPress={handleToggle}
      >
        <Text
          style={[
            styles.dropdownButtonText,
            { color: selectedOption ? colors.text : colors.textMuted },
            !selectedOption && styles.dropdownButtonPlaceholder,
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolate }] }}>
          <Ionicons
            name="chevron-down"
            size={20}
            color={isOpen ? colors.primary : colors.textMuted}
          />
        </Animated.View>
      </Pressable>

      {/* Inline Options List */}
      {isOpen && (
        <View
          style={[
            styles.optionsContainer,
            {
              backgroundColor: colors.surface,
              borderColor: colors.primary,
            },
          ]}
        >
          <ScrollView
            style={styles.optionsList}
            nestedScrollEnabled
            showsVerticalScrollIndicator
            keyboardShouldPersistTaps="handled"
          >
            {options.map((item, index) => {
              const isSelected = item.value === value;
              const isLast = index === options.length - 1;
              return (
                <Pressable
                  key={item.value}
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : 'transparent',
                      borderBottomWidth: isLast ? 0 : 1,
                      borderBottomColor: colors.border,
                    },
                  ]}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text
                    style={[
                      styles.optionLabel,
                      { color: isSelected ? colors.primary : colors.text },
                      isSelected && styles.optionLabelSelected,
                    ]}
                    numberOfLines={1}
                  >
                    {item.label}
                  </Text>
                  {isSelected && (
                    <Ionicons name="checkmark-circle" size={20} color={colors.primary} />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Error */}
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
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
  },
  required: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    marginLeft: 4,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderRadius: 14,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dropdownButtonDisabled: {
    opacity: 0.7,
  },
  dropdownButtonText: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.medium,
    marginRight: 8,
  },
  dropdownButtonPlaceholder: {
    fontStyle: 'italic',
  },
  optionsContainer: {
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: 'hidden',
  },
  optionsList: {
    maxHeight: 200,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionLabel: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    flex: 1,
    marginRight: 8,
  },
  optionLabelSelected: {
    fontFamily: FONTS.semiBold,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginLeft: 6,
  },
});

export default FormDropdown;
