import { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { FormModal, type FormFieldConfig } from './FormModal';
import { ActionModal } from './ActionModal';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

interface Teacher {
  id: string;
  name: string;
  subject: string;
  email: string;
  photo?: string;
  isClassTeacher?: boolean;
}

export interface MessageTeacherModalProps {
  /** Preferred visibility prop (web-aligned) */
  isOpen?: boolean;
  /** Back-compat visibility prop */
  visible?: boolean;
  onClose: () => void;
  onSubmit?: (data: MessageFormData) => void;
  childName?: string;
  childClass?: string;
  teachers?: Teacher[];
  preselectedTeacher?: Teacher;
}

export interface MessageFormData {
  teacherId: string;
  category: string;
  customCategory: string;
  subject: string;
  message: string;
}

// Mock teachers data
const MOCK_TEACHERS: Teacher[] = [
  {
    id: 'teacher-001',
    name: 'Mrs. Adaobi Eze',
    subject: 'Mathematics',
    email: 'adaobi.eze@school.edu',
    photo: 'https://i.pravatar.cc/150?u=teacher1',
  },
  {
    id: 'teacher-002',
    name: 'Mr. Chidi Okoro',
    subject: 'English Language',
    email: 'chidi.okoro@school.edu',
    photo: 'https://i.pravatar.cc/150?u=teacher2',
  },
  {
    id: 'teacher-003',
    name: 'Mrs. Funke Adeyemi',
    subject: 'Basic Science',
    email: 'funke.adeyemi@school.edu',
    photo: 'https://i.pravatar.cc/150?u=teacher3',
  },
  {
    id: 'teacher-004',
    name: 'Mr. Emeka Nwosu',
    subject: 'Class Teacher',
    email: 'emeka.nwosu@school.edu',
    photo: 'https://i.pravatar.cc/150?u=teacher4',
    isClassTeacher: true,
  },
];

const MESSAGE_CATEGORIES = [
  { value: 'academic', label: 'Academic Performance' },
  { value: 'homework', label: 'Homework & Assignments' },
  { value: 'attendance', label: 'Attendance' },
  { value: 'behavior', label: 'Behavior & Conduct' },
  { value: 'meeting', label: 'Request Meeting' },
  { value: 'general', label: 'General Inquiry' },
  { value: 'other', label: 'Other (Custom)' },
];

export function MessageTeacherModal({
  isOpen,
  visible,
  onClose,
  onSubmit,
  childName,
  childClass,
  teachers = MOCK_TEACHERS,
  preselectedTeacher,
}: MessageTeacherModalProps) {
  const { colors } = useTheme();
  const resolvedVisible = isOpen ?? visible ?? false;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const initialValues = useMemo<Record<string, string>>(
    () => ({
      teacherId: preselectedTeacher?.id || '',
      category: '',
      customCategory: '',
      subject: '',
      message: '',
    }),
    [preselectedTeacher?.id]
  );

  const [values, setValues] = useState<Record<string, string>>(initialValues);

  useEffect(() => {
    if (resolvedVisible) setValues(initialValues);
  }, [resolvedVisible, initialValues]);

  const selectedTeacher = useMemo(
    () => teachers.find((t) => t.id === values.teacherId),
    [teachers, values.teacherId]
  );

  const teacherOptions = useMemo(
    () =>
      teachers.map((t) => ({
        value: t.id,
        label: `${t.name} - ${t.subject}`,
      })),
    [teachers]
  );

  const fields: FormFieldConfig[] = useMemo(
    () => [
      {
        id: 'teacherId',
        label: 'To',
        type: 'dropdown',
        required: true,
        icon: <Ionicons name="person" size={16} color={colors.textMuted} />,
        iconBgColor: colors.primaryLight,
        options: teacherOptions,
        placeholder: 'Select a teacher',
      },
      {
        id: 'category',
        label: 'Category',
        type: 'dropdown',
        icon: <Ionicons name="folder" size={16} color={colors.textMuted} />,
        iconBgColor: colors.accentLight,
        options: MESSAGE_CATEGORIES,
        placeholder: 'Select category (optional)',
      },
      {
        id: 'customCategory',
        label: 'Custom Category',
        type: 'text',
        icon: <Ionicons name="create" size={16} color={colors.textMuted} />,
        iconBgColor: colors.accentLight,
        placeholder: 'Enter your custom category',
        condition: (v) => v.category === 'other',
        validate: (value, v) => {
          if (v.category === 'other' && !value.trim()) return 'Please enter a custom category';
          return undefined;
        },
      },
      {
        id: 'subject',
        label: 'Subject',
        type: 'text',
        required: true,
        icon: <Ionicons name="text" size={16} color={colors.textMuted} />,
        iconBgColor: colors.warningLight,
        placeholder: "What's this message about?",
      },
      {
        id: 'message',
        label: 'Message',
        type: 'textarea',
        required: true,
        icon: <Ionicons name="chatbox" size={16} color={colors.textMuted} />,
        iconBgColor: colors.successLight,
        placeholder: 'Type your message here...',
        rows: 5,
        maxLength: 1000,
        showCharCount: true,
        validate: (value) => {
          if (!value.trim()) return 'Please enter your message';
          if (value.trim().length < 10) return 'Message must be at least 10 characters';
          return undefined;
        },
      },
    ],
    [
      colors.accentLight,
      colors.primaryLight,
      colors.successLight,
      colors.textMuted,
      colors.warningLight,
      teacherOptions,
    ]
  );

  const subtitle = childName
    ? `For ${childName}${childClass ? ` (${childClass})` : ''}`
    : 'Send a message to a teacher';

  const handleClose = () => {
    setValues(initialValues);
    onClose();
  };

  const handleSubmit = async (submittedValues: Record<string, string>) => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const payload: MessageFormData = {
        teacherId: submittedValues.teacherId || '',
        category: submittedValues.category || '',
        customCategory: submittedValues.customCategory || '',
        subject: submittedValues.subject || '',
        message: submittedValues.message || '',
      };

      onSubmit?.(payload);
      onClose();
      setIsSuccessModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <FormModal
        visible={resolvedVisible}
        onClose={handleClose}
        title="New Message"
        subtitle={subtitle}
        icon={<Ionicons name="chatbubble-ellipses" size={22} color="#ffffff" />}
        iconBgColors={[colors.primary, colors.primaryDark]}
        fields={fields}
        values={values}
        onChange={setValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        submitLabel="Send Message"
        cancelLabel="Cancel"
        infoBanner={
          <View style={styles.info}>
            {/* Selected Teacher Preview (if selected) */}
            {selectedTeacher && (
              <View
                style={[
                  styles.teacherPreview,
                  { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                ]}
              >
                <Image
                  source={{
                    uri:
                      selectedTeacher.photo ||
                      `https://i.pravatar.cc/150?u=${selectedTeacher.id}`,
                  }}
                  style={styles.teacherPhoto}
                />
                <View style={styles.teacherInfo}>
                  <Text style={[styles.teacherName, { color: colors.text }]}>
                    {selectedTeacher.name}
                  </Text>
                  <Text style={[styles.teacherSubject, { color: colors.textMuted }]}>
                    {selectedTeacher.subject}
                  </Text>
                </View>
                {selectedTeacher.isClassTeacher && (
                  <View style={[styles.classTeacherBadge, { backgroundColor: colors.success }]}>
                    <Ionicons name="school" size={10} color="#ffffff" />
                  </View>
                )}
              </View>
            )}

            {/* Tip */}
            <View style={[styles.tipBanner, { backgroundColor: colors.backgroundTertiary }]}>
              <Ionicons name="bulb-outline" size={16} color={colors.textMuted} />
              <Text style={[styles.tipText, { color: colors.textMuted }]}>
                Teachers typically respond within 24 hours during school days.
              </Text>
            </View>
          </View>
        }
      />

      <ActionModal
        visible={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        title="Message Sent"
        subtitle={selectedTeacher ? `To ${selectedTeacher.name}` : undefined}
        variant="success"
        message="Your message has been sent successfully. You’ll be notified when there’s a reply."
        confirmLabel="Done"
        cancelLabel="Close"
        onConfirm={() => setIsSuccessModalOpen(false)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  info: {
    gap: 12,
  },
  teacherPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  teacherPhoto: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  teacherInfo: {
    flex: 1,
  },
  teacherName: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
  teacherSubject: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  classTeacherBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 12,
    borderRadius: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.regular,
    lineHeight: 18,
  },
});

export default MessageTeacherModal;

