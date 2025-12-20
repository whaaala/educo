import { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useTenantSettings } from '../../contexts/TenantSettingsContext';
import { Modal } from '../ui/Modal';
import { PaymentConfirmationModal } from './PaymentConfirmationModal';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'partial';
  paidAmount?: number;
}

export interface PayFeesModalProps {
  visible: boolean;
  onClose: () => void;
  onPaymentInitiated?: (feeId: string | null, method: PaymentMethod) => void;
  childName?: string;
  fees?: FeeItem[];
}

type PaymentMethod = 'card' | 'bank' | 'cash';

// Mock fees data
const MOCK_FEES: FeeItem[] = [
  {
    id: 'fee-001',
    name: 'Tuition Fee - Term 2',
    amount: 150000,
    dueDate: '2024-02-15',
    status: 'pending',
  },
  {
    id: 'fee-002',
    name: 'Books & Materials',
    amount: 25000,
    dueDate: '2024-01-30',
    status: 'overdue',
  },
  {
    id: 'fee-003',
    name: 'Exam Fee',
    amount: 15000,
    dueDate: '2024-02-20',
    status: 'partial',
    paidAmount: 10000,
  },
];

export function PayFeesModal({
  visible,
  onClose,
  onPaymentInitiated,
  childName,
  fees = MOCK_FEES,
}: PayFeesModalProps) {
  const { colors } = useTheme();
  const { settings } = useTenantSettings();
  const { currencySymbol, payment } = settings;

  const [selectedFee, setSelectedFee] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedFeeName, setSelectedFeeName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(payment.defaultMethod);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const totalOutstanding = fees.reduce((sum, fee) => {
    const remaining = fee.paidAmount ? fee.amount - fee.paidAmount : fee.amount;
    return sum + remaining;
  }, 0);

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusConfig = (status: FeeItem['status']) => {
    switch (status) {
      case 'overdue':
        return {
          label: 'Overdue',
          bgColor: colors.errorLight,
          textColor: colors.error,
          icon: 'alert-circle' as const,
        };
      case 'partial':
        return {
          label: 'Partial',
          bgColor: colors.warningLight,
          textColor: colors.warning,
          icon: 'time' as const,
        };
      default:
        return {
          label: 'Pending',
          bgColor: colors.primaryLight,
          textColor: colors.primary,
          icon: 'hourglass' as const,
        };
    }
  };

  const handlePayNow = (feeId: string, amount: number, feeName: string) => {
    setSelectedFee(feeId);
    setSelectedAmount(amount);
    setSelectedFeeName(feeName);
    setShowPaymentOptions(true);
    // Auto-scroll to payment methods section after a short delay
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePayAll = () => {
    setSelectedFee(null);
    setSelectedAmount(totalOutstanding);
    setSelectedFeeName('All Outstanding Fees');
    setShowPaymentOptions(true);
    // Auto-scroll to payment methods section
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setShowConfirmationModal(true);
  };

  const handleConfirmPayment = () => {
    if (onPaymentInitiated) {
      onPaymentInitiated(selectedFee, paymentMethod);
    }
    setShowConfirmationModal(false);
    if (paymentMethod === 'card') {
      // For card payments, close the modal after redirect
      setShowPaymentOptions(false);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFee(null);
    setSelectedAmount(0);
    setSelectedFeeName('');
    setShowPaymentOptions(false);
    setShowConfirmationModal(false);
    onClose();
  };

  // Build payment methods from tenant settings
  const paymentMethods = [
    ...(payment.cardPayment.enabled ? [{
      id: 'card' as const,
      label: payment.cardPayment.title,
      icon: 'card' as const,
      description: payment.cardPayment.description.slice(0, 20) + '...',
    }] : []),
    ...(payment.bankTransfer.enabled ? [{
      id: 'bank' as const,
      label: payment.bankTransfer.title,
      icon: 'business' as const,
      description: payment.bankTransfer.description.slice(0, 20) + '...',
    }] : []),
    ...(payment.cashPayment.enabled ? [{
      id: 'cash' as const,
      label: payment.cashPayment.title,
      icon: 'cash' as const,
      description: payment.cashPayment.description.slice(0, 20) + '...',
    }] : []),
  ];

  const footer = (
    <View style={styles.footer}>
      <Pressable
        style={[styles.footerButton, { backgroundColor: colors.backgroundTertiary }]}
        onPress={handleClose}
      >
        <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>Close</Text>
      </Pressable>
      <Pressable
        style={[styles.footerButton, styles.footerButtonPrimary, { backgroundColor: colors.primary }]}
        onPress={handlePayAll}
      >
        <Ionicons name="card" size={16} color="#ffffff" />
        <Text style={[styles.footerButtonText, { color: '#ffffff' }]}>Pay All ({formatCurrency(totalOutstanding)})</Text>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={handleClose}
      title="Pay Fees"
      subtitle={childName ? `Fees for ${childName}` : 'View and pay outstanding fees'}
      icon={<Ionicons name="wallet" size={22} color="#ffffff" />}
      iconBgColors={[colors.success, '#059669']}
      footer={footer}
      scrollRef={scrollRef}
    >
      <View style={styles.content}>
        {/* Total Outstanding Card */}
        <LinearGradient
          colors={['#1e293b', '#0f172a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.totalCard}
        >
          <View style={styles.totalCardPattern}>
            <View style={[styles.patternCircle, styles.patternCircleTop]} />
            <View style={[styles.patternCircle, styles.patternCircleBottom]} />
          </View>
          <View style={styles.totalCardContent}>
            <Text style={styles.totalLabel}>Total Outstanding</Text>
            <Text style={styles.totalAmount}>{formatCurrency(totalOutstanding)}</Text>
            <View style={styles.secureRow}>
              <Ionicons name="shield-checkmark" size={14} color="#34d399" />
              <Text style={styles.secureText}>Secure Payment</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Fee Items */}
        <View style={styles.feesList}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Outstanding Fees</Text>

          {fees.map((fee) => {
            const status = getStatusConfig(fee.status);
            const remainingAmount = fee.paidAmount ? fee.amount - fee.paidAmount : fee.amount;

            return (
              <View
                key={fee.id}
                style={[styles.feeItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
              >
                <View style={styles.feeItemLeft}>
                  <View style={styles.feeItemHeader}>
                    <Text style={[styles.feeName, { color: colors.text }]} numberOfLines={1}>{fee.name}</Text>
                    <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                      <Ionicons name={status.icon} size={8} color={status.textColor} />
                      <Text style={[styles.statusText, { color: status.textColor }]}>{status.label}</Text>
                    </View>
                  </View>
                  <View style={styles.feeItemFooter}>
                    <Text style={[styles.feeDueDate, { color: colors.textMuted }]}>
                      Due: {formatDate(fee.dueDate)}
                    </Text>
                    {fee.paidAmount && (
                      <Text style={[styles.paidText, { color: colors.success }]}>
                        Paid: {formatCurrency(fee.paidAmount)}
                      </Text>
                    )}
                  </View>
                </View>

                <View style={{ alignItems: 'flex-end', gap: 4 }}>
                  <Text style={[styles.feeAmount, { color: colors.text }]}>
                    {formatCurrency(remainingAmount)}
                  </Text>
                  <Pressable
                    style={[styles.payButton, { backgroundColor: colors.primary }]}
                    onPress={() => handlePayNow(fee.id, remainingAmount, fee.name)}
                  >
                    <Ionicons name="card" size={12} color="#ffffff" />
                    <Text style={styles.payButtonText}>Pay Now</Text>
                  </Pressable>
                </View>
              </View>
            );
          })}
        </View>

        {/* Payment Method Selection */}
        {showPaymentOptions && (
          <View style={[styles.paymentMethodsSection, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Select Payment Method</Text>

            <View style={styles.paymentMethodsGrid}>
              {paymentMethods.map((method) => (
                <Pressable
                  key={method.id}
                  style={[
                    styles.paymentMethodCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    paymentMethod === method.id && { borderColor: colors.primary, borderWidth: 2 },
                  ]}
                  onPress={() => handlePaymentMethodSelect(method.id)}
                >
                  <View
                    style={[
                      styles.paymentMethodIcon,
                      { backgroundColor: paymentMethod === method.id ? colors.primary : colors.backgroundTertiary },
                    ]}
                  >
                    <Ionicons
                      name={method.icon}
                      size={16}
                      color={paymentMethod === method.id ? '#ffffff' : colors.textMuted}
                    />
                  </View>
                  <Text style={[styles.paymentMethodLabel, { color: colors.text }]}>{method.label}</Text>
                  <Text style={[styles.paymentMethodDesc, { color: colors.textMuted }]}>{method.description}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Payment History Link */}
        <Pressable style={styles.historyLink}>
          <Ionicons name="receipt-outline" size={16} color={colors.primary} />
          <Text style={[styles.historyLinkText, { color: colors.primary }]}>View Payment History</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.primary} />
        </Pressable>
      </View>

      {/* Payment Confirmation Modal */}
      <PaymentConfirmationModal
        visible={showConfirmationModal}
        onClose={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmPayment}
        paymentMethod={paymentMethod}
        amount={selectedAmount}
        feeName={selectedFeeName}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
  },
  totalCard: {
    borderRadius: 14,
    padding: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  totalCardPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  patternCircle: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  patternCircleTop: {
    top: -30,
    right: -20,
  },
  patternCircleBottom: {
    bottom: -40,
    left: -30,
  },
  totalCardContent: {
    position: 'relative',
  },
  totalLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: 'rgba(255, 255, 255, 0.7)',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 2,
  },
  totalAmount: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: '#ffffff',
    marginBottom: 8,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  secureText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: '#34d399',
  },
  feesList: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    marginBottom: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  feeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  feeItemLeft: {
    flex: 1,
    marginRight: 10,
  },
  feeItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  feeItemInfo: {
    flex: 1,
  },
  feeName: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  feeDueDate: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    gap: 3,
  },
  statusText: {
    fontSize: 9,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
  },
  feeItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  feeAmount: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  paidText: {
    fontSize: 9,
    fontFamily: FONTS.medium,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  payButtonText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
  paymentMethodsSection: {
    padding: 12,
    borderRadius: 10,
    marginTop: 2,
  },
  paymentMethodsGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  paymentMethodCard: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  paymentMethodIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  paymentMethodLabel: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
  },
  paymentMethodDesc: {
    fontSize: 8,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginTop: 1,
  },
  historyLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 5,
  },
  historyLinkText: {
    fontSize: 13,
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
  footerButtonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
});

export default PayFeesModal;
