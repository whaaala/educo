import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
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
}: PayFeesModalProps): JSX.Element {
  const { colors } = useTheme();
  const { settings } = useTenantSettings();
  const { currencySymbol, payment } = settings;
  const router = useRouter();

  const [selectedFee, setSelectedFee] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number>(0);
  const [selectedFeeName, setSelectedFeeName] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(payment.defaultMethod);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [customAmountInput, setCustomAmountInput] = useState<string>('');
  const [maxPayableAmount, setMaxPayableAmount] = useState<number>(0);
  // Per-fee allocation amounts
  const [feeAllocations, setFeeAllocations] = useState<Record<string, number>>({});
  const [feeAllocationInputs, setFeeAllocationInputs] = useState<Record<string, string>>({});
  const scrollRef = useRef<ScrollView>(null);

  // Calculate total from individual fee allocations
  const totalFromAllocations = Object.values(feeAllocations).reduce((sum, val) => sum + val, 0);

  // Calculate total - fee.amount is already the remaining balance when passed from fees.tsx
  const totalOutstanding = fees.reduce((sum, fee) => sum + fee.amount, 0);

  // Track if a specific fee is selected (null means "Pay All")
  const isPayingAll = selectedFee === null;

  // Auto-show payment options when modal opens with fees - default to "Pay All"
  useEffect(() => {
    if (visible && fees.length > 0) {
      setShowPaymentOptions(true);
      // Default to "Pay All" mode
      setSelectedFee(null);
      setSelectedAmount(totalOutstanding);
      setMaxPayableAmount(totalOutstanding);
      setCustomAmountInput(totalOutstanding.toString());
      setSelectedFeeName(fees.length === 1 ? fees[0].name : 'All Outstanding Fees');
      // Initialize per-fee allocations with full amounts
      const initialAllocations: Record<string, number> = {};
      const initialInputs: Record<string, string> = {};
      fees.forEach(fee => {
        initialAllocations[fee.id] = fee.amount;
        initialInputs[fee.id] = fee.amount.toString();
      });
      setFeeAllocations(initialAllocations);
      setFeeAllocationInputs(initialInputs);
      // Auto-scroll to payment methods section after a short delay
      setTimeout(() => {
        scrollRef.current?.scrollToEnd({ animated: true });
      }, 300);
    }
  }, [visible]);

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
    setMaxPayableAmount(amount);
    setCustomAmountInput(amount.toString());
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
    setMaxPayableAmount(totalOutstanding);
    setCustomAmountInput(totalOutstanding.toString());
    setSelectedFeeName('All Outstanding Fees');
    setShowPaymentOptions(true);
    // Auto-scroll to payment methods section
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  // Handle custom amount input change
  const handleCustomAmountChange = (text: string) => {
    // Remove any non-numeric characters (only allow digits)
    const cleanedText = text.replace(/[^0-9]/g, '');

    // Prevent empty or zero-leading inputs (except single "0")
    const sanitizedText = cleanedText.replace(/^0+/, '') || '';
    setCustomAmountInput(sanitizedText);

    const numValue = parseInt(sanitizedText, 10) || 0;

    // Ensure amount is positive and doesn't exceed max payable
    if (numValue > 0 && numValue <= maxPayableAmount) {
      setSelectedAmount(numValue);
    } else if (numValue > maxPayableAmount) {
      setSelectedAmount(maxPayableAmount);
      setCustomAmountInput(maxPayableAmount.toString());
    } else {
      // For 0 or empty, set selectedAmount to 0
      setSelectedAmount(0);
    }
  };

  // Quick amount selection (percentage-based)
  const handleQuickAmount = (percentage: number) => {
    const amount = Math.floor(maxPayableAmount * (percentage / 100));
    setSelectedAmount(amount);
    setCustomAmountInput(amount.toString());
  };

  // Handle per-fee allocation input change
  const handleFeeAllocationChange = (feeId: string, text: string, feeMaxAmount: number) => {
    // Remove any non-numeric characters (only allow digits)
    const cleanedText = text.replace(/[^0-9]/g, '');
    // Prevent zero-leading inputs (except single "0")
    const sanitizedText = cleanedText.replace(/^0+/, '') || '';

    // Update input text
    setFeeAllocationInputs(prev => ({ ...prev, [feeId]: sanitizedText }));

    const numValue = parseInt(sanitizedText, 10) || 0;

    // Clamp to max fee amount
    let finalValue = numValue;
    if (numValue > feeMaxAmount) {
      finalValue = feeMaxAmount;
      setFeeAllocationInputs(prev => ({ ...prev, [feeId]: feeMaxAmount.toString() }));
    }

    // Update allocations
    setFeeAllocations(prev => {
      const newAllocations = { ...prev, [feeId]: finalValue };
      // Calculate new total
      const newTotal = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
      setSelectedAmount(newTotal);
      setCustomAmountInput(newTotal.toString());
      return newAllocations;
    });
  };

  // Quick fill for individual fee (percentage of that fee's amount)
  const handleFeeQuickAmount = (feeId: string, percentage: number, feeMaxAmount: number) => {
    const amount = Math.floor(feeMaxAmount * (percentage / 100));
    setFeeAllocationInputs(prev => ({ ...prev, [feeId]: amount.toString() }));
    setFeeAllocations(prev => {
      const newAllocations = { ...prev, [feeId]: amount };
      const newTotal = Object.values(newAllocations).reduce((sum, val) => sum + val, 0);
      setSelectedAmount(newTotal);
      setCustomAmountInput(newTotal.toString());
      return newAllocations;
    });
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
    setMaxPayableAmount(0);
    setCustomAmountInput('');
    setSelectedFeeName('');
    setShowPaymentOptions(false);
    setShowConfirmationModal(false);
    setFeeAllocations({});
    setFeeAllocationInputs({});
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

  // Determine if paying full amount or partial
  const isFullPayment = selectedAmount === maxPayableAmount;
  const isValidAmount = selectedAmount > 0;

  const footer = (
    <View style={styles.footer}>
      <Pressable
        style={[styles.footerButton, { backgroundColor: colors.backgroundTertiary }]}
        onPress={handleClose}
      >
        <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>Close</Text>
      </Pressable>
      <Pressable
        style={[
          styles.footerButton,
          { backgroundColor: isValidAmount ? colors.primary : colors.textMuted },
        ]}
        onPress={() => isValidAmount && handlePaymentMethodSelect(paymentMethod)}
        disabled={!isValidAmount}
      >
        <Ionicons name="card" size={16} color="#ffffff" />
        <Text style={[styles.footerButtonText, { color: '#ffffff' }]} numberOfLines={1}>
          {isFullPayment ? `Pay Full (${formatCurrency(selectedAmount)})` : `Pay ${formatCurrency(selectedAmount)}`}
        </Text>
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
          {/* Section Header with Pay All link */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Outstanding Fees</Text>
            {fees.length > 1 ? (
              <Pressable
                onPress={handlePayAll}
                style={[
                  styles.payAllLink,
                  {
                    backgroundColor: isPayingAll ? colors.primary : colors.primaryLight,
                    borderColor: colors.primary,
                  },
                ]}
              >
                <Ionicons name="wallet-outline" size={12} color={isPayingAll ? '#ffffff' : colors.primary} />
                <Text style={[styles.payAllLinkText, { color: isPayingAll ? '#ffffff' : colors.primary }]}>Pay All</Text>
              </Pressable>
            ) : null}
          </View>

          {fees.map((fee) => {
            const status = getStatusConfig(fee.status);
            // fee.amount is already the remaining balance
            const remainingAmount = fee.amount;
            const isSelected = selectedFee === fee.id;
            const currentAllocation = feeAllocations[fee.id] || 0;
            const currentInputValue = feeAllocationInputs[fee.id] || '';
            const isFullFee = currentAllocation === remainingAmount;
            const isPartialFee = currentAllocation > 0 && currentAllocation < remainingAmount;

            return (
              <View key={fee.id} style={styles.feeItemContainer}>
                <Pressable
                  onPress={() => handlePayNow(fee.id, remainingAmount, fee.name)}
                  style={[
                    styles.feeItem,
                    {
                      backgroundColor: isSelected ? colors.primaryLight : colors.surface,
                      borderColor: isSelected ? colors.primary : colors.border,
                      borderWidth: isSelected ? 2 : 1,
                    },
                  ]}
                >
                  <View style={styles.feeItemLeft}>
                    <View style={styles.feeItemHeader}>
                      <Text style={[styles.feeName, { color: isSelected ? colors.primary : colors.text }]} numberOfLines={1}>
                        {fee.name}
                      </Text>
                      <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
                        <Ionicons name={status.icon} size={8} color={status.textColor} />
                        <Text style={[styles.statusText, { color: status.textColor }]}>{status.label}</Text>
                      </View>
                    </View>
                    <View style={styles.feeItemFooter}>
                      <Text style={[styles.feeDueDate, { color: colors.textMuted }]}>
                        Due: {formatDate(fee.dueDate)}
                      </Text>
                      {fee.paidAmount !== undefined && fee.paidAmount > 0 && (
                        <Text style={[styles.paidText, { color: colors.success }]}>
                          Paid: {formatCurrency(fee.paidAmount)}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={[styles.feeAmount, { color: isSelected ? colors.primary : colors.text }]}>
                      {formatCurrency(remainingAmount)}
                    </Text>
                    {isSelected ? (
                      <View style={[styles.selectedIndicator, { backgroundColor: colors.primary }]}>
                        <Ionicons name="checkmark" size={12} color="#ffffff" />
                        <Text style={styles.selectedText}>Selected</Text>
                      </View>
                    ) : (
                      <View style={[styles.payButton, { backgroundColor: colors.primary }]}>
                        <Ionicons name="card" size={12} color="#ffffff" />
                        <Text style={styles.payButtonText}>Pay Now</Text>
                      </View>
                    )}
                  </View>
                </Pressable>

                {/* Individual Fee Allocation Input */}
                {showPaymentOptions && isPayingAll && (
                  <View style={[styles.feeAllocationRow, { backgroundColor: colors.backgroundSecondary }]}>
                    <View style={styles.feeAllocationInputWrapper}>
                      <Text style={[styles.feeAllocationLabel, { color: colors.textMuted }]}>Pay:</Text>
                      <View style={[styles.feeAllocationInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                        <Text style={[styles.feeAllocationCurrency, { color: colors.textSecondary }]}>{currencySymbol}</Text>
                        <TextInput
                          style={[styles.feeAllocationInput, { color: colors.text }]}
                          value={currentInputValue}
                          onChangeText={(text) => handleFeeAllocationChange(fee.id, text, remainingAmount)}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={colors.textMuted}
                        />
                      </View>
                      <Text style={[styles.feeAllocationMax, { color: colors.textMuted }]}>
                        / {formatCurrency(remainingAmount)}
                      </Text>
                    </View>
                    <View style={styles.feeAllocationQuickButtons}>
                      {[50, 100].map((percent) => {
                        const quickAmt = Math.floor(remainingAmount * (percent / 100));
                        const isActive = currentAllocation === quickAmt;
                        return (
                          <Pressable
                            key={percent}
                            style={[
                              styles.feeQuickButton,
                              { backgroundColor: isActive ? colors.primary : colors.surface, borderColor: isActive ? colors.primary : colors.border },
                            ]}
                            onPress={() => handleFeeQuickAmount(fee.id, percent, remainingAmount)}
                          >
                            <Text style={[styles.feeQuickButtonText, { color: isActive ? '#ffffff' : colors.text }]}>
                              {percent === 100 ? 'Full' : `${percent}%`}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                    {/* Status indicator */}
                    <View style={styles.feeAllocationStatus}>
                      {isFullFee && (
                        <View style={[styles.feeStatusBadge, { backgroundColor: colors.successLight }]}>
                          <Ionicons name="checkmark-circle" size={10} color={colors.success} />
                          <Text style={[styles.feeStatusText, { color: colors.success }]}>Full</Text>
                        </View>
                      )}
                      {isPartialFee && (
                        <View style={[styles.feeStatusBadge, { backgroundColor: colors.warningLight }]}>
                          <Ionicons name="remove-circle" size={10} color={colors.warning} />
                          <Text style={[styles.feeStatusText, { color: colors.warning }]}>Partial</Text>
                        </View>
                      )}
                      {currentAllocation === 0 && (
                        <View style={[styles.feeStatusBadge, { backgroundColor: colors.backgroundTertiary }]}>
                          <Ionicons name="close-circle" size={10} color={colors.textMuted} />
                          <Text style={[styles.feeStatusText, { color: colors.textMuted }]}>Skip</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Payment Allocation Section - for partial payments (only show for single fee selection) */}
        {showPaymentOptions && !isPayingAll && (
          <View style={[styles.allocationSection, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.allocationHeader}>
              <View style={styles.allocationTitleRow}>
                <Ionicons name="calculator-outline" size={16} color={colors.primary} />
                <Text style={[styles.allocationTitle, { color: colors.text }]}>Payment Amount</Text>
              </View>
              <Text style={[styles.allocationSubtitle, { color: colors.textMuted }]}>
                Enter amount or select a quick option
              </Text>
            </View>

            {/* Amount Input */}
            <View style={[styles.amountInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.currencyPrefix, { color: colors.textSecondary }]}>{currencySymbol}</Text>
              <TextInput
                style={[styles.amountInput, { color: colors.text }]}
                value={customAmountInput}
                onChangeText={handleCustomAmountChange}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={colors.textMuted}
              />
              <View style={styles.amountInputRight}>
                <Text style={[styles.maxAmountText, { color: colors.textMuted }]}>
                  of {formatCurrency(maxPayableAmount)}
                </Text>
              </View>
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmountRow}>
              {[25, 50, 75, 100].map((percent) => {
                const quickAmount = Math.floor(maxPayableAmount * (percent / 100));
                const isActive = selectedAmount === quickAmount;
                return (
                  <Pressable
                    key={percent}
                    style={[
                      styles.quickAmountButton,
                      { backgroundColor: isActive ? colors.primary : colors.surface, borderColor: isActive ? colors.primary : colors.border },
                    ]}
                    onPress={() => handleQuickAmount(percent)}
                  >
                    <Text style={[styles.quickAmountText, { color: isActive ? '#ffffff' : colors.text }]}>
                      {percent === 100 ? 'Full' : `${percent}%`}
                    </Text>
                    <Text style={[styles.quickAmountValue, { color: isActive ? 'rgba(255,255,255,0.8)' : colors.textMuted }]}>
                      {formatCurrency(quickAmount)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Remaining Balance Info */}
            {selectedAmount < maxPayableAmount && selectedAmount > 0 && (
              <View style={[styles.remainingBalanceInfo, { backgroundColor: colors.warningLight }]}>
                <Ionicons name="information-circle" size={14} color={colors.warning} />
                <Text style={[styles.remainingBalanceText, { color: colors.warning }]}>
                  Remaining after payment: {formatCurrency(maxPayableAmount - selectedAmount)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Payment Summary Section - shown when "Pay All" is selected */}
        {showPaymentOptions && isPayingAll && (
          <View style={[styles.allocationSection, { backgroundColor: colors.backgroundSecondary }]}>
            <View style={styles.allocationHeader}>
              <View style={styles.allocationTitleRow}>
                <Ionicons name="receipt-outline" size={16} color={colors.primary} />
                <Text style={[styles.allocationTitle, { color: colors.text }]}>Payment Summary</Text>
              </View>
              <Text style={[styles.allocationSubtitle, { color: colors.textMuted }]}>
                Adjust amounts for each fee above
              </Text>
            </View>

            {/* Summary totals */}
            <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Total Outstanding:</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{formatCurrency(totalOutstanding)}</Text>
              </View>
              <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Your Payment:</Text>
                <Text style={[styles.summaryValueLarge, { color: colors.primary }]}>{formatCurrency(selectedAmount)}</Text>
              </View>
              {selectedAmount < totalOutstanding && (
                <>
                  <View style={[styles.summaryDivider, { backgroundColor: colors.border }]} />
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>Remaining Balance:</Text>
                    <Text style={[styles.summaryValue, { color: colors.warning }]}>{formatCurrency(totalOutstanding - selectedAmount)}</Text>
                  </View>
                </>
              )}
            </View>

            {/* Payment status message */}
            {selectedAmount === totalOutstanding ? (
              <View style={[styles.remainingBalanceInfo, { backgroundColor: colors.successLight }]}>
                <Ionicons name="checkmark-circle" size={14} color={colors.success} />
                <Text style={[styles.remainingBalanceText, { color: colors.success }]}>
                  Paying full outstanding balance
                </Text>
              </View>
            ) : selectedAmount > 0 ? (
              <View style={[styles.remainingBalanceInfo, { backgroundColor: colors.warningLight }]}>
                <Ionicons name="information-circle" size={14} color={colors.warning} />
                <Text style={[styles.remainingBalanceText, { color: colors.warning }]}>
                  Partial payment - {formatCurrency(totalOutstanding - selectedAmount)} will remain
                </Text>
              </View>
            ) : null}
          </View>
        )}

        {/* Payment Method Selection */}
        {showPaymentOptions ? (
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
        ) : null}

        {/* Payment History Link */}
        <Pressable
          style={styles.historyLink}
          onPress={() => {
            handleClose();
            router.push({
              pathname: '/payment-history',
              params: { childName },
            });
          }}
        >
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  payAllLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  payAllLinkText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
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
  selectedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  selectedText: {
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
    justifyContent: 'space-between',
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 6,
  },
  footerButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  // Allocation Section Styles
  allocationSection: {
    padding: 12,
    borderRadius: 10,
    gap: 12,
  },
  allocationHeader: {
    gap: 2,
  },
  allocationTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allocationTitle: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  allocationSubtitle: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginLeft: 22,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 4,
  },
  currencyPrefix: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
  },
  amountInput: {
    flex: 1,
    fontSize: 22,
    fontFamily: FONTS.bold,
    paddingVertical: 0,
    minWidth: 80,
  },
  amountInputRight: {
    alignItems: 'flex-end',
  },
  maxAmountText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  quickAmountRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 2,
  },
  quickAmountText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  quickAmountValue: {
    fontSize: 9,
    fontFamily: FONTS.medium,
  },
  remainingBalanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  remainingBalanceText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    flex: 1,
  },
  // Per-fee allocation styles
  feeItemContainer: {
    gap: 0,
  },
  feeAllocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginTop: -2,
    gap: 8,
  },
  feeAllocationInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 6,
  },
  feeAllocationLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  feeAllocationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 2,
    minWidth: 80,
  },
  feeAllocationCurrency: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  feeAllocationInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.bold,
    paddingVertical: 0,
    minWidth: 50,
  },
  feeAllocationMax: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  feeAllocationQuickButtons: {
    flexDirection: 'row',
    gap: 4,
  },
  feeQuickButton: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
  },
  feeQuickButtonText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },
  feeAllocationStatus: {
    minWidth: 50,
    alignItems: 'flex-end',
  },
  feeStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 3,
  },
  feeStatusText: {
    fontSize: 9,
    fontFamily: FONTS.semiBold,
  },
  // Summary card styles
  summaryCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  summaryValueLarge: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  summaryDivider: {
    height: 1,
    marginVertical: 2,
  },
});

export default PayFeesModal;
