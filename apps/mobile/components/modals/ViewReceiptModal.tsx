import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { useTenantSettings } from '../../contexts/TenantSettingsContext';
import { Modal } from '../ui/Modal';
import { InfoModal, InfoModalType, InfoModalButton } from '../ui/InfoModal';

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export interface PaymentReceiptData {
  id: string;
  feeName: string;
  feeType: string;
  amount: number;
  paidAmount: number;
  balance: number;
  paymentDate: string;
  paymentMethod: 'card' | 'bank' | 'cash';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionRef: string;
  term: string;
  academicYear: string;
}

export interface ViewReceiptModalProps {
  /** Preferred visibility prop (web-aligned) */
  isOpen?: boolean;
  /** Back-compat visibility prop */
  visible?: boolean;
  onClose: () => void;
  payment?: PaymentReceiptData | null;
  childName?: string;
  childClass?: string;
  schoolName?: string;
}

interface InfoModalState {
  visible: boolean;
  type: InfoModalType;
  title: string;
  message: string;
  detail?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  buttons?: InfoModalButton[];
}

export function ViewReceiptModal({
  isOpen,
  visible,
  onClose,
  payment,
  childName = 'Student',
  childClass = 'Class',
  schoolName = 'Greenfield Academy',
}: ViewReceiptModalProps) {
  const { colors, isDark } = useTheme();
  const { settings } = useTenantSettings();
  const { currencySymbol } = settings;
  const resolvedVisible = isOpen ?? visible ?? false;

  // Branding with fallback defaults
  const branding = settings.branding || {
    primaryColor: '#059669',
    primaryColorDark: '#047857',
    accentColor: '#10b981',
  };

  const [isGenerating, setIsGenerating] = useState(false);
  const [infoModal, setInfoModal] = useState<InfoModalState>({
    visible: false,
    type: 'info',
    title: '',
    message: '',
  });

  // Reset isGenerating state when modal visibility changes
  useEffect(() => {
    if (!resolvedVisible) {
      setIsGenerating(false);
    }
  }, [resolvedVisible]);

  const showInfoModal = (config: Omit<InfoModalState, 'visible'>) => {
    setInfoModal({ ...config, visible: true });
  };

  const hideInfoModal = () => {
    setInfoModal(prev => ({ ...prev, visible: false }));
  };

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = () => {
    return new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: PaymentReceiptData['status']) => {
    switch (status) {
      case 'completed':
        return { label: 'PAID', color: '#16a34a', bgColor: '#dcfce7' };
      case 'pending':
        return { label: 'PENDING', color: '#f59e0b', bgColor: '#fef3c7' };
      case 'failed':
        return { label: 'FAILED', color: '#dc2626', bgColor: '#fee2e2' };
      case 'refunded':
        return { label: 'REFUNDED', color: '#6366f1', bgColor: '#e0e7ff' };
      default:
        return { label: 'UNKNOWN', color: '#6b7280', bgColor: '#f3f4f6' };
    }
  };

  const getMethodLabel = (method: PaymentReceiptData['paymentMethod']) => {
    switch (method) {
      case 'card': return 'Debit/Credit Card';
      case 'bank': return 'Bank Transfer';
      case 'cash': return 'Cash Payment';
      default: return 'Unknown';
    }
  };

  const getMethodIcon = (method: PaymentReceiptData['paymentMethod']): keyof typeof Ionicons.glyphMap => {
    switch (method) {
      case 'card': return 'card';
      case 'bank': return 'business';
      case 'cash': return 'cash';
      default: return 'help-circle';
    }
  };

  // Get status config - use default if no payment
  const statusConfig = payment ? getStatusConfig(payment.status) : { label: '', color: '#6b7280', bgColor: '#f3f4f6' };

  const generateReceiptHTML = () => {
    if (!payment) return '';

    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const currentTime = formatTime();

    // Full-page receipt design with tenant branding
    const primaryColor = branding.primaryColor;
    const primaryColorDark = branding.primaryColorDark;

    // Generate lighter shade for backgrounds
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 5, g: 150, b: 105 };
    };

    const rgb = hexToRgb(primaryColor);
    const primaryLight = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`;
    const primaryLighter = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.05)`;
    const primaryBorder = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Receipt - ${payment.transactionRef}</title>
        <style>
          @page {
            size: A4;
            margin: 0;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            background: #ffffff;
            color: #1f2937;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 100%;
            height: 100%;
          }
          .receipt {
            width: 100%;
            height: 100%;
            padding: 32px;
            background: #ffffff;
            display: flex;
            flex-direction: column;
          }
          .header {
            background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColorDark} 100%);
            color: white;
            padding: 28px 24px;
            text-align: center;
            border-radius: 12px;
            margin-bottom: 20px;
          }
          .school-name {
            font-size: 26px;
            font-weight: 700;
            margin-bottom: 6px;
            letter-spacing: -0.5px;
          }
          .receipt-title {
            font-size: 12px;
            opacity: 0.9;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 14px;
          }
          .status-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 700;
            background-color: ${statusConfig.bgColor};
            color: ${statusConfig.color};
          }
          .amount-section {
            text-align: center;
            padding: 28px 24px;
            background: linear-gradient(135deg, ${primaryLighter} 0%, ${primaryLight} 100%);
            border-radius: 12px;
            margin-bottom: 20px;
            border: 1px solid ${primaryBorder};
          }
          .amount-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 8px;
            font-weight: 600;
          }
          .amount-value {
            font-size: 42px;
            font-weight: 800;
            color: ${primaryColor};
            letter-spacing: -1px;
          }
          .payment-date {
            font-size: 14px;
            color: #6b7280;
            margin-top: 8px;
          }
          .details-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
            flex: 1;
          }
          .detail-card {
            background: #ffffff;
            border-radius: 12px;
            padding: 20px;
            border: 2px solid #e5e7eb;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
          }
          .section-title {
            font-size: 13px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            color: ${primaryColor};
            margin-bottom: 14px;
            font-weight: 800;
            padding-bottom: 10px;
            border-bottom: 2px solid ${primaryBorder};
          }
          .detail-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .detail-row:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .detail-label {
            font-size: 15px;
            font-weight: 500;
            color: #374151;
          }
          .detail-value {
            font-size: 15px;
            font-weight: 700;
            color: #111827;
            text-align: right;
          }
          .ref-section {
            background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
            color: white;
            padding: 20px 24px;
            border-radius: 12px;
            text-align: center;
            margin-bottom: 20px;
          }
          .ref-label {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            opacity: 0.7;
            margin-bottom: 6px;
          }
          .ref-value {
            font-size: 18px;
            font-weight: 700;
            letter-spacing: 1.5px;
            font-family: 'SF Mono', 'Consolas', monospace;
          }
          .footer {
            text-align: center;
            padding-top: 20px;
            border-top: 2px dashed #e5e7eb;
            margin-top: auto;
          }
          .footer-text {
            font-size: 11px;
            color: #9ca3af;
            margin-bottom: 12px;
            line-height: 1.4;
          }
          .footer-school {
            font-size: 15px;
            font-weight: 700;
            color: ${primaryColor};
          }
          .footer-timestamp {
            font-size: 10px;
            color: #9ca3af;
            margin-top: 8px;
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="school-name">${schoolName}</div>
            <div class="receipt-title">Payment Receipt</div>
            <div class="status-badge">${statusConfig.label}</div>
          </div>

          <div class="amount-section">
            <div class="amount-label">Amount Paid</div>
            <div class="amount-value">${formatCurrency(payment.paidAmount)}</div>
            <div class="payment-date">${formatDate(payment.paymentDate)}</div>
          </div>

          <div class="details-grid">
            <div class="detail-card">
              <div class="section-title">Student Information</div>
              <div class="detail-row">
                <span class="detail-label">Name</span>
                <span class="detail-value">${childName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Class</span>
                <span class="detail-value">${childClass}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Term</span>
                <span class="detail-value">${payment.term}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Year</span>
                <span class="detail-value">${payment.academicYear}</span>
              </div>
            </div>

            <div class="detail-card">
              <div class="section-title">Payment Details</div>
              <div class="detail-row">
                <span class="detail-label">Fee</span>
                <span class="detail-value">${payment.feeName}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Type</span>
                <span class="detail-value">${payment.feeType}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Method</span>
                <span class="detail-value">${getMethodLabel(payment.paymentMethod).split(' ')[0]}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Balance</span>
                <span class="detail-value" style="color: ${payment.balance > 0 ? '#dc2626' : primaryColor};">${formatCurrency(payment.balance)}</span>
              </div>
            </div>
          </div>

          <div class="ref-section">
            <div class="ref-label">Transaction Reference</div>
            <div class="ref-value">${payment.transactionRef}</div>
          </div>

          <div class="footer">
            <p class="footer-text">This is a computer-generated receipt and does not require a signature.</p>
            <p class="footer-school">${schoolName}</p>
            <p class="footer-timestamp">Generated: ${currentDate} at ${currentTime}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  const handlePreview = async () => {
    if (!payment || isGenerating) return;
    setIsGenerating(true);

    try {
      const html = generateReceiptHTML();

      // Use printAsync which opens the native print dialog with PDF preview
      await Print.printAsync({
        html,
        width: 595, // A4 width in points (72 dpi)
        height: 842, // A4 height in points
      });
    } catch (error) {
      console.error('Error previewing receipt:', error);
      const errorMessage = error instanceof Error ? error.message : '';
      // Ignore "already in progress" and user cancellation errors
      if (!errorMessage.includes('already in progress') && !errorMessage.includes('cancelled')) {
        showInfoModal({
          type: 'error',
          title: 'Preview Failed',
          message: 'Failed to preview the receipt. Please try again.',
          icon: 'alert-circle',
          buttons: [{ text: 'OK', style: 'primary' }],
        });
      }
    }
    setIsGenerating(false);
  };

  const handleShare = async () => {
    if (!payment || isGenerating) return;
    setIsGenerating(true);

    try {
      const html = generateReceiptHTML();
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
        width: 595, // A4 width in points
        height: 842, // A4 height in points
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Payment Receipt',
          UTI: 'com.adobe.pdf',
        });
      } else {
        showInfoModal({
          type: 'warning',
          title: 'Sharing Not Available',
          message: 'Sharing is not available on this device.',
          icon: 'share-outline',
          buttons: [{ text: 'OK', style: 'primary' }],
        });
      }
    } catch (error) {
      console.error('Error sharing receipt:', error);
      const errorMessage = error instanceof Error ? error.message : '';
      if (!errorMessage.includes('already in progress')) {
        showInfoModal({
          type: 'error',
          title: 'Share Failed',
          message: 'Failed to share the receipt. Please try again.',
          icon: 'alert-circle',
          buttons: [{ text: 'OK', style: 'primary' }],
        });
      }
    }
    setIsGenerating(false);
  };

  return (
    <Modal
      visible={resolvedVisible}
      onClose={onClose}
      title="Payment Receipt"
      subtitle={payment?.transactionRef || ''}
      icon={<Ionicons name="receipt" size={22} color="#ffffff" />}
      iconBgColors={['#16a34a', '#15803d']}
      footer={
        <View style={styles.footer}>
          <Pressable
            style={[styles.footerButton, { backgroundColor: colors.backgroundTertiary }]}
            onPress={onClose}
            disabled={isGenerating}
          >
            <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>Close</Text>
          </Pressable>
          <Pressable
            style={[
              styles.footerButton,
              { backgroundColor: isDark ? '#1e3a5f' : '#dbeafe', borderWidth: 1, borderColor: colors.primary },
              isGenerating && styles.footerButtonDisabled,
            ]}
            onPress={handlePreview}
            disabled={isGenerating || !payment}
          >
            <Ionicons name="eye-outline" size={16} color={colors.primary} />
            <Text style={[styles.footerButtonText, { color: colors.primary }]}>Print</Text>
          </Pressable>
          <Pressable
            style={[
              styles.footerButton,
              styles.footerButtonPrimary,
              { backgroundColor: colors.success },
              isGenerating && styles.footerButtonDisabled,
            ]}
            onPress={handleShare}
            disabled={isGenerating || !payment}
          >
            {isGenerating ? (
              <Text style={[styles.footerButtonText, { color: '#ffffff' }]}>Loading...</Text>
            ) : (
              <>
                <Ionicons name="share-outline" size={16} color="#ffffff" />
                <Text style={[styles.footerButtonText, { color: '#ffffff' }]}>Share</Text>
              </>
            )}
          </Pressable>
        </View>
      }
    >
      {payment ? (
        <View style={styles.content}>
          {/* Status Badge */}
          <View style={[styles.statusCard, { backgroundColor: statusConfig.bgColor }]}>
            <Ionicons
              name={payment.status === 'completed' ? 'checkmark-circle' : payment.status === 'pending' ? 'time' : payment.status === 'refunded' ? 'refresh' : 'close-circle'}
              size={24}
              color={statusConfig.color}
            />
            <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
          </View>

          {/* Amount Card */}
          <LinearGradient
            colors={isDark ? ['#14532d', '#1e293b'] : ['#dcfce7', '#f0fdf4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.amountCard}
          >
            <Text style={[styles.amountLabel, { color: colors.textMuted }]}>Amount Paid</Text>
            <Text style={[styles.amountValue, { color: colors.success }]}>{formatCurrency(payment.paidAmount)}</Text>
            <Text style={[styles.dateText, { color: colors.textSecondary }]}>{formatDate(payment.paymentDate)}</Text>
          </LinearGradient>

          {/* Details Section */}
          <View style={styles.detailsSection}>
            {/* Student Info */}
            <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.detailCardHeader}>
                <View style={[styles.detailCardIcon, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="person" size={14} color={colors.primary} />
                </View>
                <Text style={[styles.detailCardTitle, { color: colors.text }]}>Student</Text>
              </View>
              <Text style={[styles.detailCardValue, { color: colors.text }]}>{childName}</Text>
              <Text style={[styles.detailCardSubtext, { color: colors.textMuted }]}>{childClass} • {payment.term} • {payment.academicYear}</Text>
            </View>

            {/* Fee Info */}
            <View style={[styles.detailCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.detailCardHeader}>
                <View style={[styles.detailCardIcon, { backgroundColor: colors.successLight }]}>
                  <Ionicons name="document-text" size={14} color={colors.success} />
                </View>
                <Text style={[styles.detailCardTitle, { color: colors.text }]}>Fee Details</Text>
              </View>
              <Text style={[styles.detailCardValue, { color: colors.text }]}>{payment.feeName}</Text>
              <Text style={[styles.detailCardSubtext, { color: colors.textMuted }]}>{payment.feeType}</Text>
            </View>

            {/* Payment Info Row */}
            <View style={styles.infoRow}>
              <View style={[styles.infoCard, { backgroundColor: isDark ? colors.surface : '#eff6ff', borderColor: isDark ? colors.border : '#bfdbfe' }]}>
                <View style={[styles.infoCardIcon, { backgroundColor: isDark ? colors.infoLight : '#dbeafe' }]}>
                  <Ionicons name={getMethodIcon(payment.paymentMethod)} size={14} color={isDark ? colors.info : '#2563eb'} />
                </View>
                <Text style={[styles.infoCardLabel, { color: colors.textMuted }]}>Method</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>{getMethodLabel(payment.paymentMethod).split(' ')[0]}</Text>
              </View>

              <View style={[styles.infoCard, { backgroundColor: isDark ? colors.surface : '#fef3c7', borderColor: isDark ? colors.border : '#fcd34d' }]}>
                <View style={[styles.infoCardIcon, { backgroundColor: isDark ? colors.warningLight : '#fde68a' }]}>
                  <Ionicons name="cash" size={14} color={isDark ? colors.warning : '#d97706'} />
                </View>
                <Text style={[styles.infoCardLabel, { color: colors.textMuted }]}>Total Fee</Text>
                <Text style={[styles.infoCardValue, { color: colors.text }]}>{formatCurrency(payment.amount)}</Text>
              </View>

              <View style={[styles.infoCard, { backgroundColor: isDark ? colors.surface : (payment.balance > 0 ? '#fee2e2' : '#dcfce7'), borderColor: isDark ? colors.border : (payment.balance > 0 ? '#fca5a5' : '#86efac') }]}>
                <View style={[styles.infoCardIcon, { backgroundColor: isDark ? (payment.balance > 0 ? colors.errorLight : colors.successLight) : (payment.balance > 0 ? '#fecaca' : '#bbf7d0') }]}>
                  <Ionicons name="wallet" size={14} color={payment.balance > 0 ? (isDark ? colors.error : '#dc2626') : (isDark ? colors.success : '#16a34a')} />
                </View>
                <Text style={[styles.infoCardLabel, { color: colors.textMuted }]}>Balance</Text>
                <Text style={[styles.infoCardValue, { color: payment.balance > 0 ? (isDark ? colors.error : '#dc2626') : (isDark ? colors.success : '#16a34a') }]}>{formatCurrency(payment.balance)}</Text>
              </View>
            </View>
          </View>

          {/* Transaction Reference */}
          <View style={[styles.refCard, { backgroundColor: isDark ? '#1e293b' : '#1f2937' }]}>
            <Text style={styles.refLabel}>Transaction Reference</Text>
            <Text style={styles.refValue}>{payment.transactionRef}</Text>
          </View>

          {/* Info Banner */}
          <View style={[styles.infoBanner, { backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }]}>
            <Ionicons name="information-circle" size={16} color={colors.primary} />
            <Text style={[styles.infoText, { color: colors.primary }]}>
              Use &quot;Print&quot; to preview and print, or &quot;Share&quot; to send via email/WhatsApp.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="receipt-outline" size={48} color={colors.textMuted} />
          <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>No receipt data available</Text>
        </View>
      )}

      {/* Info Modal */}
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  statusText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    letterSpacing: 1,
  },
  amountCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  dateText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 8,
  },
  detailsSection: {
    gap: 12,
  },
  detailCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  detailCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  detailCardIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailCardTitle: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailCardValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  detailCardSubtext: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 8,
  },
  infoCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  infoCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  infoCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: 4,
  },
  infoCardValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  refCard: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  refLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  refValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#ffffff',
    letterSpacing: 2,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    fontFamily: FONTS.medium,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
  },
  footerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 6,
  },
  footerButtonPrimary: {},
  footerButtonDisabled: {
    opacity: 0.7,
  },
  footerButtonText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
});

export default ViewReceiptModal;
