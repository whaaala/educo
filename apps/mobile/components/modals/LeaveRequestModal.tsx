import { useState, useRef } from 'react';
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../ui/Modal';
import { FormDropdown } from '../ui/FormDropdown';
import { DatePicker } from '../ui/DatePicker';
import { FormTextarea } from '../ui/FormTextarea';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export interface LeaveRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit?: (data: LeaveFormData) => void;
  childName?: string;
}

export interface LeaveFormData {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
}

const LEAVE_TYPE_OPTIONS = [
  { value: 'sick', label: 'Sick Leave' },
  { value: 'family', label: 'Family Emergency' },
  { value: 'appointment', label: 'Medical Appointment' },
  { value: 'vacation', label: 'Family Vacation' },
  { value: 'religious', label: 'Religious Holiday' },
  { value: 'other', label: 'Other' },
];

export function LeaveRequestModal({
  visible,
  onClose,
  onSubmit,
  childName,
}: LeaveRequestModalProps) {
  const { colors } = useTheme();
  const scrollRef = useRef<ScrollViewType>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<LeaveFormData>({
    leaveType: '',
    startDate: '',
    endDate: '',
    reason: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof LeaveFormData, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof LeaveFormData, string>> = {};

    if (!formData.leaveType) {
      newErrors.leaveType = 'Please select a leave type';
    }
    if (!formData.startDate) {
      newErrors.startDate = 'Please select a start date';
    }
    if (!formData.endDate) {
      newErrors.endDate = 'Please select an end date';
    }
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date must be after start date';
      }
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide a reason for leave';
    } else if (formData.reason.trim().length < 10) {
      newErrors.reason = 'Reason must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (onSubmit) {
        onSubmit(formData);
      }

      // Reset form
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
      });
      setErrors({});
      onClose();

      Alert.alert(
        'Request Submitted',
        'Your leave request has been submitted successfully. You will be notified once it is reviewed.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit leave request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
    });
    setErrors({});
    onClose();
  };

  // Calculate number of days
  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return null;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : null;
  };

  const days = calculateDays();

  const footer = (
    <View style={styles.footer}>
      <Pressable
        style={[styles.footerButton, { backgroundColor: colors.backgroundTertiary }]}
        onPress={handleClose}
        disabled={isSubmitting}
      >
        <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>Cancel</Text>
      </Pressable>
      <Pressable
        style={[
          styles.footerButton,
          styles.footerButtonPrimary,
          { backgroundColor: colors.primary },
          isSubmitting && styles.footerButtonDisabled,
        ]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Text style={[styles.footerButtonText, { color: colors.primaryText }]}>Submitting...</Text>
        ) : (
          <>
            <Ionicons name="send" size={16} color={colors.primaryText} />
            <Text style={[styles.footerButtonText, { color: colors.primaryText }]}>Submit Request</Text>
          </>
        )}
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Request Leave"
      subtitle={childName ? `For ${childName}` : 'Submit a leave request'}
      icon={<Ionicons name="calendar" size={22} color="#ffffff" />}
      iconBgColors={[colors.primary, colors.primaryDark]}
      footer={footer}
      scrollRef={scrollRef}
    >
      <View style={styles.content}>
        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.infoLight }]}>
          <Ionicons name="information-circle" size={18} color={colors.info} />
          <Text style={[styles.infoBannerText, { color: colors.info }]}>
            Leave requests are reviewed within 24-48 hours. You will be notified of the status.
          </Text>
        </View>

        {/* Leave Type */}
        <FormDropdown
          label="Leave Type"
          icon={<Ionicons name="document-text" size={12} color={colors.primary} />}
          iconBgColor={colors.primaryLight}
          value={formData.leaveType}
          onChange={(value) => {
            setFormData({ ...formData, leaveType: value });
            if (errors.leaveType) setErrors({ ...errors, leaveType: undefined });
          }}
          options={LEAVE_TYPE_OPTIONS}
          placeholder="Select leave type"
          required
          error={errors.leaveType}
          parentScrollRef={scrollRef}
        />

        {/* Date Range */}
        <View style={styles.dateRow}>
          <View style={styles.dateColumn}>
            <DatePicker
              label="Start Date"
              icon={<Ionicons name="calendar-outline" size={12} color={colors.success} />}
              iconBgColor={colors.successLight}
              value={formData.startDate}
              onChange={(date) => {
                setFormData({ ...formData, startDate: date });
                if (errors.startDate) setErrors({ ...errors, startDate: undefined });
              }}
              placeholder="Select date"
              required
              error={errors.startDate}
            />
          </View>
          <View style={styles.dateColumn}>
            <DatePicker
              label="End Date"
              icon={<Ionicons name="calendar-outline" size={12} color={colors.warning} />}
              iconBgColor={colors.warningLight}
              value={formData.endDate}
              onChange={(date) => {
                setFormData({ ...formData, endDate: date });
                if (errors.endDate) setErrors({ ...errors, endDate: undefined });
              }}
              placeholder="Select date"
              required
              error={errors.endDate}
              minDate={formData.startDate}
            />
          </View>
        </View>

        {/* Duration Display */}
        {days && days > 0 && (
          <View style={[styles.durationBanner, { backgroundColor: colors.primaryLight }]}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={[styles.durationText, { color: colors.primary }]}>
              Duration: {days} {days === 1 ? 'day' : 'days'}
            </Text>
          </View>
        )}

        {/* Reason */}
        <FormTextarea
          label="Reason for Leave"
          icon={<Ionicons name="chatbubble-ellipses-outline" size={12} color={colors.accent} />}
          iconBgColor={colors.accentLight}
          value={formData.reason}
          onChangeText={(text) => {
            setFormData({ ...formData, reason: text });
            if (errors.reason) setErrors({ ...errors, reason: undefined });
          }}
          placeholder="Please explain the reason for this leave request..."
          rows={4}
          required
          error={errors.reason}
          maxLength={500}
          showCharCount
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderRadius: 12,
    gap: 10,
    marginBottom: 16,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.medium,
    lineHeight: 18,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateColumn: {
    flex: 1,
  },
  durationBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 8,
    marginBottom: 8,
  },
  durationText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  footerButtonPrimary: {},
  footerButtonDisabled: {
    opacity: 0.7,
  },
  footerButtonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
});

export default LeaveRequestModal;
