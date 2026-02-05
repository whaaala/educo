import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useTenantSettings } from '../../contexts/TenantSettingsContext';
import { Modal } from '../ui/Modal';

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export type PaymentMethod = 'card' | 'bank' | 'cash';

export interface PaymentConfirmationModalProps {
  /** Preferred visibility prop (web-aligned) */
  isOpen?: boolean;
  /** Back-compat visibility prop */
  visible?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  paymentMethod: PaymentMethod;
  amount?: number;
  feeName?: string;
}

export function PaymentConfirmationModal({
  isOpen,
  visible,
  onClose,
  onConfirm,
  paymentMethod,
  amount,
  feeName,
}: PaymentConfirmationModalProps) {
  const { colors } = useTheme();
  const { settings } = useTenantSettings();
  const { payment, currencySymbol, schoolName } = settings;
  const resolvedVisible = isOpen ?? visible ?? false;

  const formatCurrency = (value: number) => `${currencySymbol}${value.toLocaleString()}`;

  const handleCopyToClipboard = (text: string) => {
    // In a real app, use Clipboard API
    // Clipboard.setString(text);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const getModalConfig = () => {
    switch (paymentMethod) {
      case 'card':
        return {
          icon: 'card' as const,
          iconColors: ['#2563eb', '#1d4ed8'] as const,
          title: payment.cardPayment.title,
          subtitle: payment.cardPayment.description,
        };
      case 'bank':
        return {
          icon: 'business' as const,
          iconColors: ['#059669', '#047857'] as const,
          title: payment.bankTransfer.title,
          subtitle: payment.bankTransfer.description,
        };
      case 'cash':
        return {
          icon: 'cash' as const,
          iconColors: ['#f59e0b', '#d97706'] as const,
          title: payment.cashPayment.title,
          subtitle: payment.cashPayment.description,
        };
    }
  };

  const config = getModalConfig();

  const renderCardPaymentContent = () => {
    const { cardPayment } = payment;
    return (
      <View style={styles.contentContainer}>
        {/* Amount Display */}
        {amount && (
          <View style={[styles.amountCard, { backgroundColor: colors.primaryLight }]}>
            <Text style={[styles.amountLabel, { color: colors.primary }]}>Amount to Pay</Text>
            <Text style={[styles.amountValue, { color: colors.primary }]}>{formatCurrency(amount)}</Text>
            {feeName && <Text style={[styles.feeName, { color: colors.textMuted }]}>{feeName}</Text>}
          </View>
        )}

        {/* Instructions */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Ionicons name="shield-checkmark" size={18} color={colors.success} />
            <Text style={[styles.infoText, { color: colors.text }]}>Secure payment powered by {cardPayment.gatewayName}</Text>
          </View>
          <Text style={[styles.instructionsText, { color: colors.textMuted }]}>
            {cardPayment.instructions}
          </Text>
        </View>

        {/* Supported Cards */}
        <View style={styles.supportedCardsRow}>
          <Text style={[styles.supportedLabel, { color: colors.textMuted }]}>Accepted:</Text>
          {cardPayment.supportedCards.map((card) => (
            <View key={card} style={[styles.cardBadge, { backgroundColor: colors.backgroundTertiary }]}>
              <Text style={[styles.cardBadgeText, { color: colors.text }]}>{card}</Text>
            </View>
          ))}
        </View>

        {/* Processing Fee Note */}
        {cardPayment.processingFeePercent && (
          <View style={[styles.noteCard, { backgroundColor: colors.warningLight }]}>
            <Ionicons name="information-circle" size={16} color={colors.warning} />
            <Text style={[styles.noteText, { color: colors.warning }]}>
              A {cardPayment.processingFeePercent}% processing fee may apply
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderBankTransferContent = () => {
    const { bankTransfer } = payment;
    return (
      <View style={styles.contentContainer}>
        {/* Amount Display */}
        {amount && (
          <View style={[styles.amountCard, { backgroundColor: colors.successLight }]}>
            <Text style={[styles.amountLabel, { color: colors.success }]}>Amount to Transfer</Text>
            <Text style={[styles.amountValue, { color: colors.success }]}>{formatCurrency(amount)}</Text>
            {feeName && <Text style={[styles.feeName, { color: colors.textMuted }]}>{feeName}</Text>}
          </View>
        )}

        {/* Bank Details Card */}
        <View style={[styles.bankDetailsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Text style={[styles.bankDetailsTitle, { color: colors.textSecondary }]}>Bank Account Details</Text>

          <View style={styles.bankDetailRow}>
            <View style={styles.bankDetailLabel}>
              <Ionicons name="business-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.bankDetailLabelText, { color: colors.textMuted }]}>Bank</Text>
            </View>
            <Text style={[styles.bankDetailValue, { color: colors.text }]}>{bankTransfer.bankName}</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.bankDetailRow}>
            <View style={styles.bankDetailLabel}>
              <Ionicons name="card-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.bankDetailLabelText, { color: colors.textMuted }]}>Account No.</Text>
            </View>
            <View style={styles.copyRow}>
              <Text style={[styles.bankDetailValueLarge, { color: colors.text }]}>{bankTransfer.accountNumber}</Text>
              <Pressable
                onPress={() => handleCopyToClipboard(bankTransfer.accountNumber)}
                style={[styles.copyButton, { backgroundColor: colors.primaryLight }]}
              >
                <Ionicons name="copy-outline" size={14} color={colors.primary} />
              </Pressable>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.bankDetailRow}>
            <View style={styles.bankDetailLabel}>
              <Ionicons name="person-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.bankDetailLabelText, { color: colors.textMuted }]}>Account Name</Text>
            </View>
            <Text style={[styles.bankDetailValue, { color: colors.text }]}>{bankTransfer.accountName}</Text>
          </View>
        </View>

        {/* Reference Note */}
        <View style={[styles.noteCard, { backgroundColor: colors.warningLight }]}>
          <Ionicons name="alert-circle" size={16} color={colors.warning} />
          <Text style={[styles.noteText, { color: colors.warning }]}>{bankTransfer.referenceNote}</Text>
        </View>

        {/* Instructions */}
        <Text style={[styles.instructionsText, { color: colors.textMuted }]}>
          {bankTransfer.instructions}
        </Text>
      </View>
    );
  };

  const renderCashPaymentContent = () => {
    const { cashPayment } = payment;
    return (
      <View style={styles.contentContainer}>
        {/* Amount Display */}
        {amount && (
          <View style={[styles.amountCard, { backgroundColor: colors.warningLight }]}>
            <Text style={[styles.amountLabel, { color: colors.warning }]}>Amount to Pay</Text>
            <Text style={[styles.amountValue, { color: colors.warning }]}>{formatCurrency(amount)}</Text>
            {feeName && <Text style={[styles.feeName, { color: colors.textMuted }]}>{feeName}</Text>}
          </View>
        )}

        {/* Location Card */}
        <View style={[styles.locationCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.locationHeader}>
            <View style={[styles.locationIcon, { backgroundColor: colors.primaryLight }]}>
              <Ionicons name="location" size={18} color={colors.primary} />
            </View>
            <View style={styles.locationInfo}>
              <Text style={[styles.locationTitle, { color: colors.text }]}>Payment Location</Text>
              <Text style={[styles.locationAddress, { color: colors.textMuted }]}>{cashPayment.location}</Text>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          <View style={styles.scheduleRow}>
            <Ionicons name="time-outline" size={16} color={colors.textMuted} />
            <Text style={[styles.scheduleText, { color: colors.text }]}>{cashPayment.workingHours}</Text>
          </View>

          {cashPayment.contactPerson && (
            <>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View style={styles.contactRow}>
                <View style={styles.contactInfo}>
                  <Ionicons name="person-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.contactName, { color: colors.text }]}>{cashPayment.contactPerson}</Text>
                </View>
                {cashPayment.contactPhone && (
                  <Pressable
                    onPress={() => handleCall(cashPayment.contactPhone!)}
                    style={[styles.callButton, { backgroundColor: colors.successLight }]}
                  >
                    <Ionicons name="call" size={14} color={colors.success} />
                    <Text style={[styles.callButtonText, { color: colors.success }]}>Call</Text>
                  </Pressable>
                )}
              </View>
            </>
          )}
        </View>

        {/* Instructions */}
        <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.infoRow}>
            <Ionicons name="receipt-outline" size={18} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.text }]}>You'll receive an official receipt</Text>
          </View>
          <Text style={[styles.instructionsText, { color: colors.textMuted }]}>
            {cashPayment.instructions}
          </Text>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    switch (paymentMethod) {
      case 'card':
        return renderCardPaymentContent();
      case 'bank':
        return renderBankTransferContent();
      case 'cash':
        return renderCashPaymentContent();
    }
  };

  const getButtonConfig = () => {
    switch (paymentMethod) {
      case 'card':
        return { text: 'Proceed to Payment', icon: 'arrow-forward' as const };
      case 'bank':
        return { text: 'I Understand', icon: 'checkmark' as const };
      case 'cash':
        return { text: 'Got It', icon: 'checkmark' as const };
    }
  };

  const buttonConfig = getButtonConfig();

  const footer = (
    <View style={styles.footer}>
      <Pressable
        style={[styles.footerButton, styles.cancelButton, { backgroundColor: colors.backgroundTertiary }]}
        onPress={onClose}
      >
        <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>Cancel</Text>
      </Pressable>
      <Pressable
        style={[styles.footerButton, styles.confirmButton]}
        onPress={onConfirm}
      >
        <LinearGradient
          colors={config.iconColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.confirmButtonGradient}
        >
          <Text style={styles.confirmButtonText}>{buttonConfig.text}</Text>
          <Ionicons name={buttonConfig.icon} size={16} color="#ffffff" />
        </LinearGradient>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={resolvedVisible}
      onClose={onClose}
      title={config.title}
      subtitle={config.subtitle}
      icon={<Ionicons name={config.icon} size={20} color="#ffffff" />}
      iconBgColors={config.iconColors}
      footer={footer}
    >
      {renderContent()}
    </Modal>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 12,
  },
  amountCard: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  amountLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  amountValue: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    marginTop: 2,
  },
  feeName: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  infoCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    flex: 1,
  },
  instructionsText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    lineHeight: 18,
  },
  supportedCardsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  supportedLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  cardBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  cardBadgeText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },
  noteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 8,
  },
  noteText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    flex: 1,
  },
  bankDetailsCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  bankDetailsTitle: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  bankDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bankDetailLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  bankDetailLabelText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  bankDetailValue: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  bankDetailValueLarge: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  copyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  copyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
  },
  locationCard: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  locationIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationInfo: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  locationAddress: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  scheduleText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contactInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactName: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  callButtonText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  footer: {
    flexDirection: 'row',
    gap: 10,
  },
  footerButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
  },
  confirmButton: {},
  confirmButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
  },
  footerButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  confirmButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
});

export default PaymentConfirmationModal;
