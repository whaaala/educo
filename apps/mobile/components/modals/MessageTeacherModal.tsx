import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../ui/Modal';
import { FormDropdown } from '../ui/FormDropdown';
import { FormInput } from '../ui/FormInput';
import { FormTextarea } from '../ui/FormTextarea';

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
  visible: boolean;
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
];

export function MessageTeacherModal({
  visible,
  onClose,
  onSubmit,
  childName,
  childClass,
  teachers = MOCK_TEACHERS,
  preselectedTeacher,
}: MessageTeacherModalProps) {
  const { colors } = useTheme();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<MessageFormData>({
    teacherId: preselectedTeacher?.id || '',
    category: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof MessageFormData, string>>>({});

  const selectedTeacher = teachers.find((t) => t.id === formData.teacherId);

  const teacherOptions = teachers.map((t) => ({
    value: t.id,
    label: `${t.name} - ${t.subject}`,
  }));

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof MessageFormData, string>> = {};

    if (!formData.teacherId) {
      newErrors.teacherId = 'Please select a teacher';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Please enter a subject';
    }
    if (!formData.message.trim()) {
      newErrors.message = 'Please enter your message';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
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
        teacherId: preselectedTeacher?.id || '',
        category: '',
        subject: '',
        message: '',
      });
      setErrors({});
      onClose();

      Alert.alert(
        'Message Sent',
        `Your message has been sent to ${selectedTeacher?.name}. They will respond shortly.`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      teacherId: preselectedTeacher?.id || '',
      category: '',
      subject: '',
      message: '',
    });
    setErrors({});
    onClose();
  };

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
          <Text style={[styles.footerButtonText, { color: colors.primaryText }]}>Sending...</Text>
        ) : (
          <>
            <Ionicons name="send" size={16} color={colors.primaryText} />
            <Text style={[styles.footerButtonText, { color: colors.primaryText }]}>Send Message</Text>
          </>
        )}
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="New Message"
      subtitle={childName ? `For ${childName}${childClass ? ` (${childClass})` : ''}` : 'Send a message to a teacher'}
      icon={<Ionicons name="chatbubble-ellipses" size={22} color="#ffffff" />}
      iconBgColors={[colors.primary, colors.primaryDark]}
      footer={footer}
    >
      <View style={styles.content}>
        {/* Selected Teacher Preview (if selected) */}
        {selectedTeacher && (
          <View style={[styles.teacherPreview, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
            <Image
              source={{ uri: selectedTeacher.photo || `https://i.pravatar.cc/150?u=${selectedTeacher.id}` }}
              style={styles.teacherPhoto}
            />
            <View style={styles.teacherInfo}>
              <Text style={[styles.teacherName, { color: colors.text }]}>{selectedTeacher.name}</Text>
              <Text style={[styles.teacherSubject, { color: colors.textMuted }]}>{selectedTeacher.subject}</Text>
            </View>
            {selectedTeacher.isClassTeacher && (
              <View style={[styles.classTeacherBadge, { backgroundColor: colors.success }]}>
                <Ionicons name="school" size={10} color="#ffffff" />
              </View>
            )}
          </View>
        )}

        {/* Teacher Selection */}
        <FormDropdown
          label="To"
          icon={<Ionicons name="person" size={12} color={colors.primary} />}
          iconBgColor={colors.primaryLight}
          value={formData.teacherId}
          onChange={(value) => {
            setFormData({ ...formData, teacherId: value });
            if (errors.teacherId) setErrors({ ...errors, teacherId: undefined });
          }}
          options={teacherOptions}
          placeholder="Select a teacher"
          required
          error={errors.teacherId}
        />

        {/* Category Selection */}
        <FormDropdown
          label="Category"
          icon={<Ionicons name="folder" size={12} color={colors.accent} />}
          iconBgColor={colors.accentLight}
          value={formData.category}
          onChange={(value) => setFormData({ ...formData, category: value })}
          options={MESSAGE_CATEGORIES}
          placeholder="Select category (optional)"
        />

        {/* Subject */}
        <FormInput
          label="Subject"
          icon={<Ionicons name="text" size={12} color={colors.warning} />}
          iconBgColor={colors.warningLight}
          value={formData.subject}
          onChangeText={(text) => {
            setFormData({ ...formData, subject: text });
            if (errors.subject) setErrors({ ...errors, subject: undefined });
          }}
          placeholder="What's this message about?"
          required
          error={errors.subject}
        />

        {/* Message */}
        <FormTextarea
          label="Message"
          icon={<Ionicons name="chatbox" size={12} color={colors.success} />}
          iconBgColor={colors.successLight}
          value={formData.message}
          onChangeText={(text) => {
            setFormData({ ...formData, message: text });
            if (errors.message) setErrors({ ...errors, message: undefined });
          }}
          placeholder="Type your message here..."
          rows={5}
          required
          error={errors.message}
          maxLength={1000}
          showCharCount
        />

        {/* Tip */}
        <View style={[styles.tipBanner, { backgroundColor: colors.backgroundTertiary }]}>
          <Ionicons name="bulb-outline" size={16} color={colors.textMuted} />
          <Text style={[styles.tipText, { color: colors.textMuted }]}>
            Teachers typically respond within 24 hours during school days.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 4,
  },
  teacherPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
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
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginTop: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.medium,
    lineHeight: 16,
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

export default MessageTeacherModal;
