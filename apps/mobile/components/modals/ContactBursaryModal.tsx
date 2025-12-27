import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../ui/Modal';
import { InfoModal, InfoModalType, InfoModalButton } from '../ui/InfoModal';

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

interface InfoModalState {
  visible: boolean;
  type: InfoModalType;
  title: string;
  message: string;
  detail?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  buttons?: InfoModalButton[];
}

export function ContactBursaryModal({
  visible,
  onClose,
  contact = DEFAULT_BURSARY_CONTACT,
  schoolName = 'Greenfield Academy',
}: ContactBursaryModalProps) {
  const { colors, isDark } = useTheme();
  const [isCallingDisabled, setIsCallingDisabled] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModalState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  const showInfoModal = (config: Omit<InfoModalState, 'visible'>) => {
    setInfoModal({ ...config, visible: true });
  };

  const hideInfoModal = () => {
    setInfoModal(prev => ({ ...prev, visible: false }));
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      showInfoModal({
        type: 'success',
        title: 'Copied!',
        message: `${label} has been copied to your clipboard.`,
        detail: text,
        icon: 'checkmark-circle',
        buttons: [{ text: 'Done', style: 'primary' }],
      });
    } catch (error) {
      showInfoModal({
        type: 'error',
        title: 'Copy Failed',
        message: 'Could not copy to clipboard. Please try again.',
        buttons: [{ text: 'OK', style: 'primary' }],
      });
    }
  };

  const handleCall = async () => {
    // Clean the phone number - remove spaces but keep the + for international format
    const phoneNumber = contact.phone.replace(/\s/g, '');

    // Use telprompt on iOS (shows confirmation dialog) or tel on Android
    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;

    try {
      // On real devices, just try to open directly - canOpenURL can be unreliable
      // especially on Android emulators or devices without proper telephony setup
      await Linking.openURL(url);
    } catch (error) {
      // If direct opening fails, try the alternative scheme
      const fallbackUrl = Platform.OS === 'ios' ? `tel:${phoneNumber}` : `tel:${phoneNumber}`;

      try {
        const canOpen = await Linking.canOpenURL(fallbackUrl);
        if (canOpen) {
          await Linking.openURL(fallbackUrl);
        } else {
          // Device cannot make calls - show copy option
          showInfoModal({
            type: 'warning',
            title: 'Cannot Make Call',
            message: 'Your device does not support making phone calls directly. You can copy the number and dial manually.',
            detail: contact.phone,
            icon: 'call',
            buttons: [
              { text: 'Cancel', style: 'default' },
              {
                text: 'Copy Number',
                style: 'primary',
                onPress: () => copyToClipboard(contact.phone, 'Phone number'),
              },
            ],
          });
        }
      } catch (fallbackError) {
        // All attempts failed - show copy option
        showInfoModal({
          type: 'warning',
          title: 'Cannot Make Call',
          message: 'Unable to initiate a phone call from this device. You can copy the number and dial manually.',
          detail: contact.phone,
          icon: 'call',
          buttons: [
            { text: 'Cancel', style: 'default' },
            {
              text: 'Copy Number',
              style: 'primary',
              onPress: () => copyToClipboard(contact.phone, 'Phone number'),
            },
          ],
        });
      }
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
        showInfoModal({
          type: 'warning',
          title: 'Cannot Open Email',
          message: 'No email app is available on your device. You can copy the email address and use your preferred email service.',
          detail: contact.email,
          icon: 'mail',
          buttons: [
            { text: 'Cancel', style: 'default' },
            {
              text: 'Copy Email',
              style: 'primary',
              onPress: () => copyToClipboard(contact.email, 'Email address'),
            },
          ],
        });
      }
    } catch (error) {
      showInfoModal({
        type: 'error',
        title: 'Email Failed',
        message: 'Failed to open email app. Please try again or copy the email address.',
        detail: contact.email,
        icon: 'mail',
        buttons: [
          { text: 'Cancel', style: 'default' },
          {
            text: 'Copy Email',
            style: 'primary',
            onPress: () => copyToClipboard(contact.email, 'Email address'),
          },
        ],
      });
    }
  };

  const handleWhatsApp = async () => {
    const phoneNumber = contact.phone.replace(/\s/g, '').replace('+', '');
    const message = encodeURIComponent('Hello, I would like to inquire about school fees.');

    // Try both WhatsApp URL schemes
    const urlSchemes = [
      `whatsapp://send?phone=${phoneNumber}&text=${message}`,
      `https://wa.me/${phoneNumber}?text=${message}`,
    ];

    let whatsappOpened = false;

    for (const url of urlSchemes) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          whatsappOpened = true;
          break;
        }
      } catch (error) {
        continue;
      }
    }

    if (!whatsappOpened) {
      showInfoModal({
        type: 'info',
        title: 'WhatsApp Not Available',
        message: 'WhatsApp is not installed on your device. You can copy the phone number and contact them through other means.',
        detail: contact.phone,
        icon: 'logo-whatsapp',
        buttons: [
          { text: 'Cancel', style: 'default' },
          {
            text: 'Copy Number',
            style: 'primary',
            onPress: () => copyToClipboard(contact.phone, 'Phone number'),
          },
        ],
      });
    }
  };

  const handleCopyPhone = () => {
    copyToClipboard(contact.phone, 'Phone number');
  };

  const handleCopyEmail = () => {
    copyToClipboard(contact.email, 'Email address');
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

      {/* Info Modal for alerts */}
      <InfoModal
        visible={infoModal.visible}
        onClose={hideInfoModal}
        type={infoModal.type}
        title={infoModal.title}
        message={infoModal.message}
        detail={infoModal.detail}
        icon={infoModal.icon}
        buttons={infoModal.buttons}
      />
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
