import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Alert,
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

interface FeeItem {
  id: string;
  name: string;
  feeType: string;
  total: number;
  paid: number;
  balance: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
  term: string;
}

export interface DownloadStatementModalProps {
  visible: boolean;
  onClose: () => void;
  childName: string;
  childClass: string;
  schoolName?: string;
  term?: string;
  academicYear?: string;
  fees?: FeeItem[];
}

type StatementType = 'current' | 'term' | 'year' | 'all';
type ExportFormat = 'pdf' | 'share';

interface InfoModalState {
  visible: boolean;
  type: InfoModalType;
  title: string;
  message: string;
  detail?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  buttons?: InfoModalButton[];
}

// Mock fee data for statement
const MOCK_FEES: FeeItem[] = [
  {
    id: 'fee-001',
    name: 'School Fees',
    feeType: 'Tuition',
    total: 150000,
    paid: 100000,
    balance: 50000,
    dueDate: '2024-02-15',
    status: 'partial',
    term: '2nd Term',
  },
  {
    id: 'fee-002',
    name: 'Bus Fee',
    feeType: 'Transport',
    total: 25000,
    paid: 0,
    balance: 25000,
    dueDate: '2024-02-01',
    status: 'overdue',
    term: '2nd Term',
  },
  {
    id: 'fee-003',
    name: 'Exam Fee',
    feeType: 'Examination',
    total: 15000,
    paid: 15000,
    balance: 0,
    dueDate: '2024-02-20',
    status: 'paid',
    term: '2nd Term',
  },
];

export function DownloadStatementModal({
  visible,
  onClose,
  childName,
  childClass,
  schoolName = 'Greenfield Academy',
  term = '2nd Term',
  academicYear = '2024/2025',
  fees = MOCK_FEES,
}: DownloadStatementModalProps) {
  const { colors, isDark } = useTheme();
  const { settings } = useTenantSettings();
  const { currencySymbol } = settings;

  const [selectedType, setSelectedType] = useState<StatementType>('current');
  const [isGenerating, setIsGenerating] = useState(false);
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

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate totals
  const totalAmount = fees.reduce((sum, fee) => sum + fee.total, 0);
  const totalPaid = fees.reduce((sum, fee) => sum + fee.paid, 0);
  const totalBalance = fees.reduce((sum, fee) => sum + fee.balance, 0);

  const statementTypes: { id: StatementType; label: string; description: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { id: 'current', label: 'Current Outstanding', description: 'Unpaid fees only', icon: 'alert-circle-outline' },
    { id: 'term', label: 'Term Statement', description: `${term} fees`, icon: 'calendar-outline' },
    { id: 'year', label: 'Academic Year', description: `${academicYear} summary`, icon: 'school-outline' },
    { id: 'all', label: 'Complete History', description: 'All transactions', icon: 'document-text-outline' },
  ];

  const generateStatementHTML = () => {
    const currentDate = new Date().toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'paid': return '#16a34a';
        case 'partial': return '#f59e0b';
        case 'overdue': return '#dc2626';
        default: return '#6b7280';
      }
    };

    const getStatusLabel = (status: string) => {
      switch (status) {
        case 'paid': return 'PAID';
        case 'partial': return 'PARTIAL';
        case 'overdue': return 'OVERDUE';
        default: return 'PENDING';
      }
    };

    const feeRows = fees.map(fee => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 600; color: #1f2937;">${fee.name}</div>
          <div style="font-size: 12px; color: #6b7280;">${fee.feeType}</div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">${formatCurrency(fee.total)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #16a34a;">${formatCurrency(fee.paid)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: ${fee.balance > 0 ? '#dc2626' : '#16a34a'};">${formatCurrency(fee.balance)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="padding: 4px 8px; border-radius: 12px; font-size: 10px; font-weight: 600; background-color: ${getStatusColor(fee.status)}20; color: ${getStatusColor(fee.status)};">
            ${getStatusLabel(fee.status)}
          </span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 12px; color: #6b7280;">${formatDate(fee.dueDate)}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fee Statement - ${childName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background: #f9fafb; padding: 20px; }
          .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 30px; }
          .header h1 { font-size: 24px; margin-bottom: 4px; }
          .header p { opacity: 0.9; font-size: 14px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; padding: 24px; background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
          .info-item label { display: block; font-size: 11px; text-transform: uppercase; color: #6b7280; margin-bottom: 4px; letter-spacing: 0.5px; }
          .info-item span { font-size: 15px; font-weight: 600; color: #1f2937; }
          .summary-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; padding: 24px; }
          .summary-card { padding: 16px; border-radius: 10px; text-align: center; }
          .summary-card.total { background: #eff6ff; }
          .summary-card.paid { background: #f0fdf4; }
          .summary-card.balance { background: #fef2f2; }
          .summary-card label { display: block; font-size: 11px; text-transform: uppercase; color: #6b7280; margin-bottom: 6px; }
          .summary-card span { font-size: 20px; font-weight: 700; }
          .summary-card.total span { color: #2563eb; }
          .summary-card.paid span { color: #16a34a; }
          .summary-card.balance span { color: #dc2626; }
          table { width: 100%; border-collapse: collapse; }
          th { padding: 12px; text-align: left; font-size: 11px; text-transform: uppercase; color: #6b7280; background: #f9fafb; border-bottom: 2px solid #e5e7eb; letter-spacing: 0.5px; }
          th:not(:first-child) { text-align: right; }
          th:nth-child(5) { text-align: center; }
          .footer { padding: 20px; background: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; }
          .footer p { font-size: 12px; color: #6b7280; }
          .footer .generated { font-size: 10px; margin-top: 8px; color: #9ca3af; }
          @media print {
            body { padding: 0; background: white; }
            .container { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${schoolName}</h1>
            <p>Fee Statement</p>
          </div>

          <div class="info-grid">
            <div class="info-item">
              <label>Student Name</label>
              <span>${childName}</span>
            </div>
            <div class="info-item">
              <label>Class</label>
              <span>${childClass}</span>
            </div>
            <div class="info-item">
              <label>Term</label>
              <span>${term}</span>
            </div>
            <div class="info-item">
              <label>Academic Year</label>
              <span>${academicYear}</span>
            </div>
          </div>

          <div class="summary-cards">
            <div class="summary-card total">
              <label>Total Fees</label>
              <span>${formatCurrency(totalAmount)}</span>
            </div>
            <div class="summary-card paid">
              <label>Amount Paid</label>
              <span>${formatCurrency(totalPaid)}</span>
            </div>
            <div class="summary-card balance">
              <label>Balance Due</label>
              <span>${formatCurrency(totalBalance)}</span>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Fee Description</th>
                <th>Total</th>
                <th>Paid</th>
                <th>Balance</th>
                <th>Status</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              ${feeRows}
            </tbody>
          </table>

          <div class="footer">
            <p>This is a computer-generated statement and does not require a signature.</p>
            <p class="generated">Generated on ${currentDate}</p>
          </div>
        </div>
      </body>
      </html>
    `;
  };

  // Store the generated PDF URI for sharing after preview
  const [generatedPdfUri, setGeneratedPdfUri] = useState<string | null>(null);

  const handlePreview = async () => {
    setIsGenerating(true);

    try {
      const html = generateStatementHTML();

      // Use printAsync to show the native print/preview dialog
      await Print.printAsync({
        html,
      });
    } catch (error) {
      console.error('Error previewing PDF:', error);
      showInfoModal({
        type: 'error',
        title: 'Preview Failed',
        message: 'Failed to preview the fee statement. Please try again.',
        icon: 'alert-circle',
        buttons: [{ text: 'OK', style: 'primary' }],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async (format: ExportFormat) => {
    setIsGenerating(true);

    try {
      const html = generateStatementHTML();

      // Generate PDF file
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      setGeneratedPdfUri(uri);

      if (format === 'share') {
        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'application/pdf',
            dialogTitle: 'Share Fee Statement',
            UTI: 'com.adobe.pdf',
          });
        } else {
          showInfoModal({
            type: 'warning',
            title: 'Sharing Not Available',
            message: 'Sharing is not available on this device. The PDF has been saved to your device.',
            icon: 'share-outline',
            buttons: [{ text: 'OK', style: 'primary' }],
          });
        }
      } else {
        // Show success and offer to share
        showInfoModal({
          type: 'success',
          title: 'Statement Generated',
          message: 'Your fee statement has been generated successfully. Would you like to share it?',
          icon: 'document-text',
          buttons: [
            { text: 'Close', style: 'default' },
            {
              text: 'Share PDF',
              style: 'primary',
              onPress: async () => {
                const isAvailable = await Sharing.isAvailableAsync();
                if (isAvailable) {
                  await Sharing.shareAsync(uri, {
                    mimeType: 'application/pdf',
                    dialogTitle: 'Share Fee Statement',
                  });
                }
              },
            },
          ],
        });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      showInfoModal({
        type: 'error',
        title: 'Generation Failed',
        message: 'Failed to generate the fee statement. Please try again.',
        icon: 'alert-circle',
        buttons: [{ text: 'OK', style: 'primary' }],
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const footer = (
    <View style={styles.footer}>
      <Pressable
        style={[styles.footerButton, styles.footerButtonSmall, { backgroundColor: colors.backgroundTertiary }]}
        onPress={onClose}
        disabled={isGenerating}
      >
        <Text style={[styles.footerButtonText, { color: colors.textSecondary }]}>Cancel</Text>
      </Pressable>
      <Pressable
        style={[
          styles.footerButton,
          styles.footerButtonSmall,
          { backgroundColor: isDark ? '#1e3a5f' : '#dbeafe', borderWidth: 1, borderColor: colors.primary },
          isGenerating && styles.footerButtonDisabled,
        ]}
        onPress={handlePreview}
        disabled={isGenerating}
      >
        <Ionicons name="eye-outline" size={16} color={colors.primary} />
        <Text style={[styles.footerButtonText, { color: colors.primary }]}>Preview</Text>
      </Pressable>
      <Pressable
        style={[
          styles.footerButton,
          { backgroundColor: colors.success, flex: 1.2 },
          isGenerating && styles.footerButtonDisabled,
        ]}
        onPress={() => handleDownload('share')}
        disabled={isGenerating}
      >
        {isGenerating ? (
          <Text style={[styles.footerButtonText, { color: '#ffffff' }]}>Generating...</Text>
        ) : (
          <>
            <Ionicons name="share-outline" size={16} color="#ffffff" />
            <Text style={[styles.footerButtonText, { color: '#ffffff' }]}>Share PDF</Text>
          </>
        )}
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Download Statement"
      subtitle="Export fee breakdown"
      icon={<Ionicons name="document-text" size={22} color="#ffffff" />}
      iconBgColors={['#16a34a', '#15803d']}
      footer={footer}
    >
      <View style={styles.content}>
        {/* Student Info Card */}
        <View style={[styles.studentCard, { backgroundColor: isDark ? colors.surface : '#f8fafc', borderColor: colors.border }]}>
          <LinearGradient
            colors={isDark ? ['#14532d', '#1e293b'] : ['#dcfce7', '#f0fdf4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.studentCardGradient}
          >
            <View style={[styles.studentAvatar, { backgroundColor: isDark ? '#16a34a' : '#22c55e' }]}>
              <Ionicons name="person" size={24} color="#ffffff" />
            </View>
            <View style={styles.studentInfo}>
              <Text style={[styles.studentName, { color: colors.text }]}>{childName}</Text>
              <Text style={[styles.studentClass, { color: colors.textSecondary }]}>{childClass} • {term}</Text>
            </View>
            <View style={[styles.yearBadge, { backgroundColor: isDark ? '#166534' : '#bbf7d0' }]}>
              <Text style={[styles.yearBadgeText, { color: isDark ? '#4ade80' : '#15803d' }]}>{academicYear}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: isDark ? '#1e3a5f' : '#eff6ff' }]}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Total</Text>
            <Text style={[styles.summaryValue, { color: isDark ? '#60a5fa' : '#2563eb' }]}>{formatCurrency(totalAmount)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: isDark ? '#14532d' : '#f0fdf4' }]}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Paid</Text>
            <Text style={[styles.summaryValue, { color: isDark ? '#4ade80' : '#16a34a' }]}>{formatCurrency(totalPaid)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: isDark ? '#7f1d1d' : '#fef2f2' }]}>
            <Text style={[styles.summaryLabel, { color: colors.textMuted }]}>Balance</Text>
            <Text style={[styles.summaryValue, { color: isDark ? '#f87171' : '#dc2626' }]}>{formatCurrency(totalBalance)}</Text>
          </View>
        </View>

        {/* Statement Type Selection */}
        <View style={styles.typeSection}>
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>SELECT STATEMENT TYPE</Text>
          <View style={styles.typeGrid}>
            {statementTypes.map((type) => (
              <Pressable
                key={type.id}
                style={[
                  styles.typeCard,
                  {
                    backgroundColor: selectedType === type.id
                      ? (isDark ? colors.successLight : '#dcfce7')
                      : colors.surface,
                    borderColor: selectedType === type.id ? colors.success : colors.border,
                    borderWidth: selectedType === type.id ? 2 : 1,
                  },
                ]}
                onPress={() => setSelectedType(type.id)}
              >
                <View style={[
                  styles.typeIconWrap,
                  {
                    backgroundColor: selectedType === type.id
                      ? (isDark ? '#166534' : '#bbf7d0')
                      : (isDark ? colors.backgroundTertiary : '#f1f5f9'),
                  },
                ]}>
                  <Ionicons
                    name={type.icon}
                    size={18}
                    color={selectedType === type.id ? (isDark ? '#4ade80' : '#16a34a') : colors.textMuted}
                  />
                </View>
                <View style={styles.typeContent}>
                  <Text style={[styles.typeLabel, { color: selectedType === type.id ? colors.success : colors.text }]}>
                    {type.label}
                  </Text>
                  <Text style={[styles.typeDesc, { color: colors.textMuted }]}>{type.description}</Text>
                </View>
                {selectedType === type.id && (
                  <View style={[styles.typeCheck, { backgroundColor: colors.success }]}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  </View>
                )}
              </Pressable>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Pressable
            style={[styles.quickActionButton, { backgroundColor: isDark ? '#14532d' : '#dcfce7', borderColor: isDark ? '#16a34a' : '#bbf7d0' }]}
            onPress={handlePreview}
            disabled={isGenerating}
          >
            <Ionicons name="eye-outline" size={18} color={isDark ? '#4ade80' : '#16a34a'} />
            <Text style={[styles.quickActionText, { color: isDark ? '#4ade80' : '#16a34a' }]}>Preview & Print</Text>
          </Pressable>
          <Pressable
            style={[styles.quickActionButton, { backgroundColor: isDark ? '#1e3a5f' : '#eff6ff', borderColor: isDark ? '#2563eb' : '#bfdbfe' }]}
            onPress={() => handleDownload('share')}
            disabled={isGenerating}
          >
            <Ionicons name="share-outline" size={18} color={isDark ? '#60a5fa' : '#2563eb'} />
            <Text style={[styles.quickActionText, { color: isDark ? '#60a5fa' : '#2563eb' }]}>Share PDF</Text>
          </Pressable>
        </View>

        {/* Info Banner */}
        <View style={[styles.infoBanner, { backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }]}>
          <Ionicons name="information-circle" size={16} color={colors.primary} />
          <Text style={[styles.infoText, { color: colors.primary }]}>
            Tap "Preview & Print" to see and print the statement, or "Share PDF" to send it via email/WhatsApp.
          </Text>
        </View>
      </View>

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
  studentCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  studentCardGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 12,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  studentClass: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  yearBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  yearBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 8,
  },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginTop: 4,
  },
  typeSection: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    letterSpacing: 0.5,
  },
  typeGrid: {
    gap: 8,
  },
  typeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 12,
  },
  typeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeContent: {
    flex: 1,
  },
  typeLabel: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  typeDesc: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  typeCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  quickActionText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
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
  footerButtonSmall: {
    flex: 0.8,
    paddingVertical: 12,
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

export default DownloadStatementModal;
