import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { DatePicker } from '../ui/DatePicker';
import { FormModal, type FormFieldConfig } from './FormModal';
import { ActionModal } from './ActionModal';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export interface LeaveRequestModalProps {
  /** Preferred visibility prop (web-aligned) */
  isOpen?: boolean;
  /** Back-compat visibility prop */
  visible?: boolean;
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

function calculateDays(startDate?: string, endDate?: string) {
  if (!startDate || !endDate) return null;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  return diff > 0 ? diff : null;
}

export function LeaveRequestModal({
  isOpen,
  visible,
  onClose,
  onSubmit,
  childName,
}: LeaveRequestModalProps) {
  const { colors } = useTheme();
  const resolvedVisible = isOpen ?? visible ?? false;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const initialValues = useMemo<Record<string, string>>(
    () => ({
      leaveType: '',
      startDate: '',
      endDate: '',
      reason: '',
    }),
    []
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  useEffect(() => {
    if (resolvedVisible) setValues(initialValues);
  }, [resolvedVisible, initialValues]);

  const days = useMemo(
    () => calculateDays(values.startDate, values.endDate),
    [values.startDate, values.endDate]
  );

  const fields: FormFieldConfig[] = useMemo(
    () => [
      {
        id: 'leaveType',
        label: 'Leave Type',
        type: 'dropdown',
        required: true,
        icon: <Ionicons name="document-text" size={16} color={colors.textMuted} />,
        iconBgColor: colors.primaryLight,
        options: LEAVE_TYPE_OPTIONS,
        placeholder: 'Select leave type',
      },
      {
        id: 'startDate',
        label: 'Start Date',
        type: 'custom',
        required: true,
        render: (value, onChange, error) => (
          <DatePicker
            label="Start Date"
            icon={<Ionicons name="calendar-outline" size={16} color={colors.textMuted} />}
            iconBgColor={colors.successLight}
            value={value}
            onChange={onChange}
            placeholder="Select start date"
            required
            error={error}
          />
        ),
      },
      {
        id: 'endDate',
        label: 'End Date',
        type: 'custom',
        required: true,
        render: (value, onChange, error) => (
          <DatePicker
            label="End Date"
            icon={<Ionicons name="calendar" size={16} color={colors.textMuted} />}
            iconBgColor={colors.warningLight}
            value={value}
            onChange={onChange}
            placeholder="Select end date"
            required
            minDate={values.startDate || undefined}
            error={error}
          />
        ),
        validate: (value, allValues) => {
          if (!value) return undefined;
          const start = allValues.startDate ? new Date(allValues.startDate) : null;
          const end = new Date(value);
          if (start && end < start) return 'End date must be after start date';
          return undefined;
        },
      },
      {
        id: 'reason',
        label: 'Reason',
        type: 'textarea',
        required: true,
        icon: <Ionicons name="chatbox-ellipses-outline" size={16} color={colors.textMuted} />,
        iconBgColor: colors.infoLight,
        placeholder: 'Provide a reason for leave...',
        rows: 4,
        maxLength: 500,
        showCharCount: true,
        validate: (value) => {
          if (!value.trim()) return 'Please provide a reason for leave';
          if (value.trim().length < 10) return 'Reason must be at least 10 characters';
          return undefined;
        },
      },
    ],
    [
      colors.infoLight,
      colors.primaryLight,
      colors.successLight,
      colors.textMuted,
      colors.warningLight,
      values.startDate,
    ]
  );

  const handleClose = () => {
    setValues(initialValues);
    onClose();
  };

  const handleSubmit = async (submittedValues: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const payload: LeaveFormData = {
        leaveType: submittedValues.leaveType || '',
        startDate: submittedValues.startDate || '',
        endDate: submittedValues.endDate || '',
        reason: submittedValues.reason || '',
      };

      onSubmit?.(payload);
      onClose();
      setIsSuccessModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtitle = childName ? `For ${childName}` : 'Submit a leave request';

  return (
    <>
      <FormModal
        visible={resolvedVisible}
        onClose={handleClose}
        title="Request Leave"
        subtitle={subtitle}
        icon={<Ionicons name="calendar" size={22} color="#ffffff" />}
        iconBgColors={[colors.primary, colors.primaryDark]}
        fields={fields}
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Submit Request"
        cancelLabel="Cancel"
        infoBanner={
          <View style={styles.bannerWrap}>
            <View style={[styles.infoBanner, { backgroundColor: colors.infoLight }]}>
              <Ionicons name="information-circle" size={18} color={colors.info} />
              <Text style={[styles.infoBannerText, { color: colors.info }]}>
                Leave requests are reviewed within 24–48 hours. You will be notified of the status.
              </Text>
            </View>

            {days ? (
              <View style={[styles.daysChip, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
                <Ionicons name="time-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.daysChipText, { color: colors.textMuted }]}>
                  {days} day{days === 1 ? '' : 's'}
                </Text>
              </View>
            ) : null}
          </View>
        }
      />

      <ActionModal
        visible={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Request Submitted"
        subtitle={childName ? `For ${childName}` : undefined}
        variant="success"
        message="Your leave request has been submitted successfully. You will be notified once it is reviewed."
        confirmLabel="Done"
        cancelLabel="Close"
        onConfirm={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  bannerWrap: {
    gap: 10,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.regular,
    lineHeight: 18,
  },
  daysChip: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  daysChipText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
});

export default LeaveRequestModal;

