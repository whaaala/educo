import type { ReactNode } from 'react';
import { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
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

export interface DatePickerProps {
  label: string;
  icon: ReactNode;
  iconBgColor?: string;
  value: string; // ISO date string
  onChange: (date: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  minDate?: string;
  maxDate?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function DatePicker({
  label,
  icon,
  iconBgColor,
  value,
  onChange,
  placeholder = 'Select date',
  disabled = false,
  required = false,
  error,
  minDate: _minDate,
  maxDate: _maxDate,
}: DatePickerProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) return new Date(value);
    return new Date();
  });

  const selectedDate = value ? new Date(value) : null;

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get calendar days for current month view
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get the day of week (0 = Sunday, we want Monday = 0)
    let startDay = firstDay.getDay() - 1;
    if (startDay < 0) startDay = 6;

    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }

    // Current month days
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      days.push({ date, isCurrentMonth: true });
    }

    // Next month days (fill to 42 cells - 6 rows)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      const date = new Date(year, month + 1, i);
      days.push({ date, isCurrentMonth: false });
    }

    return days;
  }, [viewDate]);

  const handleDateSelect = (date: Date) => {
    const isoDate = date.toISOString().split('T')[0];
    onChange(isoDate);
    setIsOpen(false);
  };

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    const today = new Date();
    setViewDate(today);
    handleDateSelect(today);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
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

      {/* Date Button */}
      <Pressable
        style={[
          styles.dateButton,
          { backgroundColor: colors.inputBackground, borderColor: error ? colors.error : colors.inputBorder },
          disabled && styles.dateButtonDisabled,
        ]}
        onPress={() => !disabled && setIsOpen(true)}
      >
        <Ionicons name="calendar-outline" size={18} color={colors.textMuted} style={styles.calendarIcon} />
        <Text
          style={[
            styles.dateButtonText,
            { color: value ? colors.text : colors.inputPlaceholder },
            !value && styles.dateButtonPlaceholder,
          ]}
        >
          {value ? formatDateDisplay(value) : placeholder}
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

      {/* Calendar Modal */}
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
              <Pressable onPress={handlePrevMonth} style={[styles.navButton, { backgroundColor: colors.backgroundTertiary }]}>
                <Ionicons name="chevron-back" size={20} color={colors.text} />
              </Pressable>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
              </Text>
              <Pressable onPress={handleNextMonth} style={[styles.navButton, { backgroundColor: colors.backgroundTertiary }]}>
                <Ionicons name="chevron-forward" size={20} color={colors.text} />
              </Pressable>
            </View>

            {/* Day Headers */}
            <View style={styles.dayHeaders}>
              {DAYS.map((day) => (
                <Text key={day} style={[styles.dayHeader, { color: colors.textMuted }]}>{day}</Text>
              ))}
            </View>

            {/* Calendar Grid */}
            <View style={styles.calendarGrid}>
              {calendarDays.map((dayInfo, index) => {
                const isCurrentMonth = dayInfo.isCurrentMonth;
                const isTodayDate = isToday(dayInfo.date);
                const isSelectedDate = isSelected(dayInfo.date);

                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.dayCell,
                      isTodayDate && [styles.dayCellToday, { borderColor: colors.primary }],
                      isSelectedDate && [styles.dayCellSelected, { backgroundColor: colors.primary }],
                    ]}
                    onPress={() => handleDateSelect(dayInfo.date)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        { color: isCurrentMonth ? colors.text : colors.textMuted },
                        isSelectedDate && styles.dayTextSelected,
                      ]}
                    >
                      {dayInfo.date.getDate()}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Footer */}
            <View style={[styles.modalFooter, { borderTopColor: colors.border }]}>
              <Pressable
                style={[styles.footerButton, { backgroundColor: colors.backgroundTertiary }]}
                onPress={() => {
                  onChange('');
                  setIsOpen(false);
                }}
              >
                <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>Clear</Text>
              </Pressable>
              <Pressable
                style={[styles.footerButton, styles.footerButtonPrimary, { backgroundColor: colors.primary }]}
                onPress={handleToday}
              >
                <Text style={[styles.footerButtonText, { color: colors.primaryText }]}>Today</Text>
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
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 14,
    minHeight: 50,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dateButtonDisabled: {
    opacity: 0.7,
  },
  calendarIcon: {
    marginRight: 10,
  },
  dateButtonText: {
    flex: 1,
    fontSize: 15,
    fontFamily: FONTS.medium,
  },
  dateButtonPlaceholder: {
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
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  navButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  dayHeaders: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },
  dayCellToday: {
    borderWidth: 2,
  },
  dayCellSelected: {
    borderRadius: 10,
  },
  dayText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  dayTextSelected: {
    color: '#ffffff',
    fontFamily: FONTS.bold,
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 1,
    gap: 12,
  },
  footerButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  footerButtonPrimary: {},
  footerButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
});

export default DatePicker;
