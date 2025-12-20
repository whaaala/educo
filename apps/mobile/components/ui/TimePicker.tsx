import type { ReactNode } from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export interface TimePickerProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  value: string; // HH:mm format
  onChange: (time: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  format?: '12h' | '24h';
}

export function TimePicker({
  label,
  icon,
  iconBgColor,
  value,
  onChange,
  placeholder = 'Select time',
  disabled = false,
  required = false,
  error,
  format = '12h',
}: TimePickerProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  // Parse current value
  const parseValue = () => {
    if (!value) {
      return { hours: 9, minutes: 0, period: 'AM' as const };
    }
    const [h, m] = value.split(':').map(Number);
    if (format === '12h') {
      return {
        hours: h % 12 || 12,
        minutes: m,
        period: h >= 12 ? ('PM' as const) : ('AM' as const),
      };
    }
    return { hours: h, minutes: m, period: 'AM' as const };
  };

  const [selectedHour, setSelectedHour] = useState(() => parseValue().hours);
  const [selectedMinute, setSelectedMinute] = useState(() => parseValue().minutes);
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>(() => parseValue().period);

  // Update when value changes
  useEffect(() => {
    const parsed = parseValue();
    setSelectedHour(parsed.hours);
    setSelectedMinute(parsed.minutes);
    setSelectedPeriod(parsed.period);
  }, [value]);

  // Generate hours and minutes
  const hours = format === '12h'
    ? Array.from({ length: 12 }, (_, i) => i + 1)
    : Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Format time for display
  const formatTimeDisplay = () => {
    if (!value) return '';
    const [h, m] = value.split(':').map(Number);
    if (format === '12h') {
      const hour12 = h % 12 || 12;
      const period = h >= 12 ? 'PM' : 'AM';
      return `${hour12}:${m.toString().padStart(2, '0')} ${period}`;
    }
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const handleConfirm = () => {
    let hour24 = selectedHour;
    if (format === '12h') {
      if (selectedPeriod === 'PM' && selectedHour !== 12) {
        hour24 = selectedHour + 12;
      } else if (selectedPeriod === 'AM' && selectedHour === 12) {
        hour24 = 0;
      }
    }
    const timeString = `${hour24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;
    onChange(timeString);
    setIsOpen(false);
  };

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
      </View>

      {/* Time Button */}
      <Pressable
        style={[
          styles.timeButton,
          { backgroundColor: colors.inputBackground, borderColor: error ? colors.error : colors.inputBorder },
          disabled && styles.timeButtonDisabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
      >
        <Ionicons name="time-outline" size={18} color={colors.textMuted} style={styles.timeIcon} />
        <Text
          style={[
            styles.timeButtonText,
            { color: value ? colors.text : colors.inputPlaceholder },
            !value && styles.timeButtonPlaceholder,
          ]}
        >
          {value ? formatTimeDisplay() : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
      </Pressable>

      {/* Error */}
      {error && (
        <View style={styles.errorRow}>
          <Ionicons name="alert-circle" size={14} color={colors.error} />
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
        </View>
      )}

      {/* Time Picker Modal */}
      <Modal
        visible={isOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable style={[styles.modalBackdrop, { backgroundColor: colors.modalOverlay }]} onPress={() => setIsOpen(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.modalBackground }]}>
            {/* Handle Bar */}
            <View style={styles.handleBarContainer}>
              <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
            </View>

            {/* Header */}
            <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Time</Text>
              <Pressable onPress={() => setIsOpen(false)} style={[styles.closeBtn, { backgroundColor: colors.backgroundTertiary }]}>
                <Ionicons name="close" size={22} color={colors.textMuted} />
              </Pressable>
            </View>

            {/* Time Display */}
            <View style={[styles.timeDisplay, { backgroundColor: colors.primaryLight }]}>
              <Text style={[styles.timeDisplayText, { color: colors.primary }]}>
                {selectedHour}:{selectedMinute.toString().padStart(2, '0')}
                {format === '12h' ? ` ${selectedPeriod}` : ''}
              </Text>
            </View>

            {/* Pickers */}
            <View style={styles.pickersContainer}>
              {/* Hours */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: colors.textMuted }]}>Hour</Text>
                <ScrollView
                  style={[styles.pickerScroll, { backgroundColor: colors.backgroundSecondary }]}
                  showsVerticalScrollIndicator={false}
                >
                  {hours.map((hour) => (
                    <Pressable
                      key={hour}
                      style={[
                        styles.pickerItem,
                        selectedHour === hour && [styles.pickerItemSelected, { backgroundColor: colors.primary }],
                      ]}
                      onPress={() => setSelectedHour(hour)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          { color: colors.text },
                          selectedHour === hour && styles.pickerItemTextSelected,
                        ]}
                      >
                        {hour.toString().padStart(2, '0')}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* Minutes */}
              <View style={styles.pickerColumn}>
                <Text style={[styles.pickerLabel, { color: colors.textMuted }]}>Minute</Text>
                <ScrollView
                  style={[styles.pickerScroll, { backgroundColor: colors.backgroundSecondary }]}
                  showsVerticalScrollIndicator={false}
                >
                  {minutes.map((minute) => (
                    <Pressable
                      key={minute}
                      style={[
                        styles.pickerItem,
                        selectedMinute === minute && [styles.pickerItemSelected, { backgroundColor: colors.primary }],
                      ]}
                      onPress={() => setSelectedMinute(minute)}
                    >
                      <Text
                        style={[
                          styles.pickerItemText,
                          { color: colors.text },
                          selectedMinute === minute && styles.pickerItemTextSelected,
                        ]}
                      >
                        {minute.toString().padStart(2, '0')}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              {/* AM/PM */}
              {format === '12h' && (
                <View style={styles.pickerColumn}>
                  <Text style={[styles.pickerLabel, { color: colors.textMuted }]}>Period</Text>
                  <View style={[styles.periodPicker, { backgroundColor: colors.backgroundSecondary }]}>
                    {(['AM', 'PM'] as const).map((period) => (
                      <Pressable
                        key={period}
                        style={[
                          styles.periodItem,
                          selectedPeriod === period && [styles.periodItemSelected, { backgroundColor: colors.primary }],
                        ]}
                        onPress={() => setSelectedPeriod(period)}
                      >
                        <Text
                          style={[
                            styles.periodItemText,
                            { color: colors.text },
                            selectedPeriod === period && styles.periodItemTextSelected,
                          ]}
                        >
                          {period}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              )}
            </View>

            {/* Footer */}
            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.footerButton, { backgroundColor: colors.backgroundTertiary }]}
                onPress={() => setIsOpen(false)}
              >
                <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.footerButton, styles.footerButtonPrimary, { backgroundColor: colors.primary }]}
                onPress={handleConfirm}
              >
                <Text style={[styles.footerButtonText, { color: colors.primaryText }]}>Confirm</Text>
              </Pressable>
            </View>
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
  },
  required: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    marginLeft: 4,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timeButtonDisabled: {
    opacity: 0.7,
  },
  timeIcon: {
    marginRight: 10,
  },
  timeButtonText: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.medium,
  },
  timeButtonPlaceholder: {
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
    marginLeft: 6,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeDisplay: {
    marginHorizontal: 20,
    marginVertical: 16,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  timeDisplayText: {
    fontSize: 32,
    fontFamily: FONTS.bold,
  },
  pickersContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 12,
  },
  pickerColumn: {
    flex: 1,
  },
  pickerLabel: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
    marginBottom: 8,
  },
  pickerScroll: {
    height: 180,
    borderRadius: 12,
  },
  pickerItem: {
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
    marginVertical: 2,
  },
  pickerItemSelected: {
    borderRadius: 8,
  },
  pickerItemText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
  },
  pickerItemTextSelected: {
    color: '#ffffff',
    fontFamily: FONTS.bold,
  },
  periodPicker: {
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  periodItem: {
    paddingVertical: 16,
    alignItems: 'center',
    borderRadius: 8,
    marginVertical: 4,
    marginHorizontal: 4,
  },
  periodItemSelected: {},
  periodItemText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
  },
  periodItemTextSelected: {
    color: '#ffffff',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    gap: 12,
  },
  footerButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },
  footerButtonPrimary: {},
  footerButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
});

export default TimePicker;
