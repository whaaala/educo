import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../ui/Modal';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export interface BursaryContact {
  name: string;
  title: string;
  phone: string;
  email: string;
  officeHours: string;
  location?: string;
}

export interface ContactBursaryModalProps {
  visible: boolean;
  onClose: () => void;
  contact?: BursaryContact;
  schoolName?: string;
}

// Default bursary contact info
const DEFAULT_BURSARY_CONTACT: BursaryContact = {
  name: 'Mrs. Ngozi Okafor',
  title: 'Senior Bursar',
  phone: '+234 803 456 7890',
  email: 'bursary@greenfield.edu.ng',
  officeHours: 'Mon - Fri: 8:00 AM - 4:00 PM',
  location: 'Admin Block, Ground Floor',
};

export function ContactBursaryModal({
  visible,
  onClose,
  contact = DEFAULT_BURSARY_CONTACT,
  schoolName = 'Greenfield Academy',
}: ContactBursaryModalProps) {
  const { colors, isDark } = useTheme();
  const [isCallingDisabled, setIsCallingDisabled] = useState(false);

  const handleCall = async () => {
    const phoneNumber = contact.phone.replace(/\s/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Cannot Make Call',
          'Your device does not support making phone calls. Please dial manually: ' + contact.phone,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to initiate call. Please try again.');
    }
  };

  const handleEmail = async () => {
    const subject = encodeURIComponent('Fee Payment Inquiry');
    const body = encodeURIComponent(`Dear ${contact.name},\n\nI would like to inquire about...\n\nThank you.`);
    const url = `mailto:${contact.email}?subject=${subject}&body=${body}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'Cannot Open Email',
          'No email app found. Please email manually: ' + contact.email,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open email app. Please try again.');
    }
  };

  const handleWhatsApp = async () => {
    const phoneNumber = contact.phone.replace(/\s/g, '').replace('+', '');
    const message = encodeURIComponent('Hello, I would like to inquire about school fees.');
    const url = `whatsapp://send?phone=${phoneNumber}&text=${message}`;

    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'WhatsApp Not Available',
          'WhatsApp is not installed on your device.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open WhatsApp. Please try again.');
    }
  };

  const handleCopyPhone = () => {
    // In a real app, you'd use Clipboard.setString
    Alert.alert('Phone Number', contact.phone, [{ text: 'OK' }]);
  };

  const handleCopyEmail = () => {
    // In a real app, you'd use Clipboard.setString
    Alert.alert('Email Address', contact.email, [{ text: 'OK' }]);
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Contact Bursary"
      subtitle={schoolName}
      icon={<Ionicons name="call" size={22} color="#ffffff" />}
      iconBgColors={['#2563eb', '#1d4ed8']}
    >
      <View style={styles.content}>
        {/* Bursar Profile Card */}
        <View style={[styles.profileCard, { backgroundColor: isDark ? colors.surface : '#f8fafc', borderColor: colors.border }]}>
          <LinearGradient
            colors={isDark ? ['#1e3a5f', '#1e293b'] : ['#dbeafe', '#eff6ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileGradient}
          >
            <View style={[styles.profileAvatar, { backgroundColor: isDark ? '#2563eb' : '#3b82f6' }]}>
              <Ionicons name="person" size={28} color="#ffffff" />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, { color: colors.text }]}>{contact.name}</Text>
              <Text style={[styles.profileTitle, { color: colors.textSecondary }]}>{contact.title}</Text>
            </View>
            <View style={[styles.verifiedBadge, { backgroundColor: isDark ? '#166534' : '#dcfce7' }]}>
              <Ionicons name="checkmark-circle" size={12} color={isDark ? '#4ade80' : '#16a34a'} />
              <Text style={[styles.verifiedText, { color: isDark ? '#4ade80' : '#16a34a' }]}>Verified</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Contact Actions */}
        <View style={styles.actionsSection}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>CONTACT OPTIONS</Text>

          {/* Call Option */}
          <Pressable
            style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleCall}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: isDark ? '#1e3a5f' : '#dbeafe' }]}>
              <Ionicons name="call" size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Call Directly</Text>
              <Text style={[styles.actionValue, { color: colors.primary }]}>{contact.phone}</Text>
            </View>
            <View style={[styles.actionArrow, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </View>
          </Pressable>

          {/* Email Option */}
          <Pressable
            style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleEmail}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: isDark ? '#1e3a3a' : '#d1fae5' }]}>
              <Ionicons name="mail" size={20} color={isDark ? '#34d399' : '#059669'} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>Send Email</Text>
              <Text style={[styles.actionValue, { color: colors.success }]} numberOfLines={1}>{contact.email}</Text>
            </View>
            <View style={[styles.actionArrow, { backgroundColor: colors.successLight }]}>
              <Ionicons name="chevron-forward" size={16} color={colors.success} />
            </View>
          </Pressable>

          {/* WhatsApp Option */}
          <Pressable
            style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={handleWhatsApp}
          >
            <View style={[styles.actionIconWrap, { backgroundColor: isDark ? '#14532d' : '#dcfce7' }]}>
              <Ionicons name="logo-whatsapp" size={20} color={isDark ? '#4ade80' : '#16a34a'} />
            </View>
            <View style={styles.actionContent}>
              <Text style={[styles.actionTitle, { color: colors.text }]}>WhatsApp Message</Text>
              <Text style={[styles.actionValue, { color: isDark ? '#4ade80' : '#16a34a' }]}>Send instant message</Text>
            </View>
            <View style={[styles.actionArrow, { backgroundColor: isDark ? '#14532d' : '#dcfce7' }]}>
              <Ionicons name="chevron-forward" size={16} color={isDark ? '#4ade80' : '#16a34a'} />
            </View>
          </Pressable>
        </View>

        {/* Office Info */}
        <View style={[styles.infoSection, { backgroundColor: isDark ? colors.backgroundTertiary : '#fafafa', borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <View style={[styles.infoIconWrap, { backgroundColor: isDark ? '#3f2f1f' : '#fef3c7' }]}>
              <Ionicons name="time" size={14} color={isDark ? '#fbbf24' : '#d97706'} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Office Hours</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{contact.officeHours}</Text>
            </View>
          </View>

          {contact.location && (
            <View style={[styles.infoRow, { marginTop: 12 }]}>
              <View style={[styles.infoIconWrap, { backgroundColor: isDark ? '#3f1515' : '#fee2e2' }]}>
                <Ionicons name="location" size={14} color={isDark ? '#f87171' : '#dc2626'} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textMuted }]}>Location</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{contact.location}</Text>
              </View>
            </View>
          )}
        </View>

        {/* Tip Banner */}
        <View style={[styles.tipBanner, { backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }]}>
          <Ionicons name="information-circle" size={16} color={colors.primary} />
          <Text style={[styles.tipText, { color: colors.primary }]}>
            For urgent payment issues, calling is recommended for faster response.
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  profileCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  profileGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  profileAvatar: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  profileTitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },
  actionsSection: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  actionValue: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  actionArrow: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoSection: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoIconWrap: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  infoValue: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    marginTop: 2,
  },
  tipBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.medium,
    lineHeight: 16,
  },
});

export default ContactBursaryModal;
