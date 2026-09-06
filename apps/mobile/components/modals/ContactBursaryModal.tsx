import { useMemo, useState } from 'react';
import { Linking, Platform } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { DetailViewModal, type DetailSection, type DetailAction } from './DetailViewModal';
import { ActionModal, type ActionVariant, type ActionButton } from './ActionModal';

export interface BursaryContact {
  name: string;
  title: string;
  phone: string;
  email: string;
  officeHours: string;
  location?: string;
}

export interface ContactBursaryModalProps {
  /** Preferred visibility prop (web-aligned) */
  isOpen?: boolean;
  /** Back-compat visibility prop */
  visible?: boolean;
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

interface FeedbackState {
  visible: boolean;
  variant: ActionVariant;
  title: string;
  message: string;
  detail?: string;
  actions?: ActionButton[];
}

export function ContactBursaryModal({
  isOpen,
  visible,
  onClose,
  contact = DEFAULT_BURSARY_CONTACT,
  schoolName = 'Greenfield Academy',
}: ContactBursaryModalProps) {
  const { colors } = useTheme();
  const resolvedVisible = isOpen ?? visible ?? false;
  const [feedback, setFeedback] = useState<FeedbackState>({
    visible: false,
    variant: 'info',
    title: '',
    message: '',
  });

  const showFeedback = (next: Omit<FeedbackState, 'visible'>) => {
    setFeedback({ ...next, visible: true });
  };

  const hideFeedback = () => setFeedback((prev) => ({ ...prev, visible: false }));

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await Clipboard.setStringAsync(text);
      showFeedback({
        variant: 'success',
        title: 'Copied',
        message: `${label} has been copied to your clipboard.`,
        detail: text,
      });
    } catch {
      showFeedback({
        variant: 'warning',
        title: 'Copy failed',
        message: 'Could not copy to clipboard. Please try again.',
      });
    }
  };

  const handleCall = async () => {
    const phoneNumber = contact.phone.replace(/\s/g, '');
    const url = Platform.OS === 'ios' ? `telprompt:${phoneNumber}` : `tel:${phoneNumber}`;
    try {
      await Linking.openURL(url);
    } catch {
      showFeedback({
        variant: 'warning',
        title: 'Cannot make call',
        message:
          'Your device could not start a phone call. You can copy the number and dial manually.',
        detail: contact.phone,
        actions: [
          { id: 'cancel', label: 'Cancel', variant: 'ghost', onPress: hideFeedback },
          {
            id: 'copy',
            label: 'Copy Number',
            variant: 'primary',
            onPress: () => copyToClipboard(contact.phone, 'Phone number'),
          },
        ],
      });
    }
  };

  const handleEmail = async () => {
    const subject = encodeURIComponent('Fee Payment Inquiry');
    const body = encodeURIComponent(
      `Dear ${contact.name},\n\nI would like to inquire about...\n\nThank you.`
    );
    const url = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    try {
      await Linking.openURL(url);
    } catch {
      showFeedback({
        variant: 'info',
        title: 'Cannot open email',
        message:
          'No email app is available on your device. You can copy the email address and use your preferred email service.',
        detail: contact.email,
        actions: [
          { id: 'cancel', label: 'Cancel', variant: 'ghost', onPress: hideFeedback },
          {
            id: 'copy',
            label: 'Copy Email',
            variant: 'primary',
            onPress: () => copyToClipboard(contact.email, 'Email address'),
          },
        ],
      });
    }
  };

  const handleWhatsApp = async () => {
    const phoneNumber = contact.phone.replace(/\s/g, '').replace('+', '');
    const message = encodeURIComponent('Hello, I would like to inquire about school fees.');
    const urlSchemes = [
      `whatsapp://send?phone=${phoneNumber}&text=${message}`,
      `https://wa.me/${phoneNumber}?text=${message}`,
    ];

    for (const url of urlSchemes) {
      try {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
          return;
        }
      } catch {
        // try next
      }
    }

    showFeedback({
      variant: 'info',
      title: 'WhatsApp not available',
      message:
        'WhatsApp is not installed on your device. You can copy the phone number and contact the bursary through other means.',
      detail: contact.phone,
      actions: [
        { id: 'cancel', label: 'Cancel', variant: 'ghost', onPress: hideFeedback },
        {
          id: 'copy',
          label: 'Copy Number',
          variant: 'primary',
          onPress: () => copyToClipboard(contact.phone, 'Phone number'),
        },
      ],
    });
  };

  const sections: DetailSection[] = useMemo(
    () => [
      {
        id: 'contact',
        type: 'grid',
        columns: 2,
        fields: [
          { label: 'Contact', value: contact.name, fullWidth: true },
          { label: 'Role', value: contact.title },
          { label: 'Office Hours', value: contact.officeHours },
          { label: 'Phone', value: contact.phone, fullWidth: true },
          { label: 'Email', value: contact.email, fullWidth: true },
          ...(contact.location
            ? [{ label: 'Location', value: contact.location, fullWidth: true }]
            : []),
        ],
      },
      {
        id: 'note',
        type: 'description',
        content:
          'Use the actions below to reach the bursary office for fee-related support, statements, or payment clarifications.',
      },
    ],
    [contact]
  );

  const actions: DetailAction[] = useMemo(
    () => [
      {
        id: 'call',
        label: 'Call',
        icon: 'call',
        variant: 'primary',
        onPress: handleCall,
      },
      {
        id: 'email',
        label: 'Email',
        icon: 'mail',
        variant: 'secondary',
        onPress: handleEmail,
      },
      {
        id: 'whatsapp',
        label: 'WhatsApp',
        icon: 'logo-whatsapp',
        variant: 'ghost',
        onPress: handleWhatsApp,
      },
      {
        id: 'copy',
        label: 'Copy',
        icon: 'copy',
        variant: 'ghost',
        onPress: () => copyToClipboard(`${contact.phone} • ${contact.email}`, 'Contact details'),
      },
    ],
    [contact.email, contact.phone]
  );

  return (
    <>
      <DetailViewModal
        visible={resolvedVisible}
        onClose={onClose}
        title="Contact Bursary"
        subtitle={schoolName}
        icon={<Ionicons name="cash" size={22} color="#ffffff" />}
        iconBgColors={[colors.primary, colors.primaryDark]}
        sections={sections}
        actions={actions}
      />

      <ActionModal
        visible={feedback.visible}
        onClose={hideFeedback}
        title={feedback.title}
        variant={feedback.variant}
        message={feedback.message}
        detail={feedback.detail}
        actions={feedback.actions}
        confirmLabel="Done"
        cancelLabel="Close"
        onConfirm={hideFeedback}
      />
    </>
  );
}

export default ContactBursaryModal;

