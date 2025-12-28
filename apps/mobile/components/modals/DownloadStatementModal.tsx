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

    const currentTime = new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const getStatusColor = (status: string) => {
      switch (status) {
        case 'paid': return '#16a34a';
        case 'partial': return '#f59e0b';
        case 'overdue': return '#dc2626';
        default: return '#6b7280';
      }
    };

    const getStatusBgColor = (status: string) => {
      switch (status) {
        case 'paid': return '#dcfce7';
        case 'partial': return '#fef3c7';
        case 'overdue': return '#fee2e2';
        default: return '#f3f4f6';
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

    const feeRows = fees.map((fee, index) => `
      <tr style="background-color: ${index % 2 === 0 ? '#ffffff' : '#fafafa'};">
        <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb;">
          <div style="font-weight: 700; font-size: 15px; color: #111827; margin-bottom: 4px;">${fee.name}</div>
          <div style="font-size: 13px; color: #6b7280; font-weight: 500;">${fee.feeType} • ${fee.term}</div>
        </td>
        <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 15px; font-weight: 600; color: #374151;">${formatCurrency(fee.total)}</td>
        <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 15px; font-weight: 600; color: #16a34a;">${formatCurrency(fee.paid)}</td>
        <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 15px; font-weight: 700; color: ${fee.balance > 0 ? '#dc2626' : '#16a34a'};">${formatCurrency(fee.balance)}</td>
        <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="display: inline-block; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; background-color: ${getStatusBgColor(fee.status)}; color: ${getStatusColor(fee.status)};">
            ${getStatusLabel(fee.status)}
          </span>
        </td>
        <td style="padding: 16px 20px; border-bottom: 1px solid #e5e7eb; text-align: right; font-size: 14px; color: #6b7280; font-weight: 500;">${formatDate(fee.dueDate)}</td>
      </tr>
    `).join('');

    // Calculate payment percentage
    const paymentPercentage = totalAmount > 0 ? Math.round((totalPaid / totalAmount) * 100) : 0;

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Fee Statement - ${childName}</title>
        <style>
          @page {
            size: A4;
            margin: 15mm 12mm;
          }
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          html, body {
            width: 100%;
            height: 100%;
            font-family: 'Helvetica Neue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: #ffffff;
            color: #1f2937;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .page {
            width: 100%;
            min-height: auto;
            padding: 0;
            display: flex;
            flex-direction: column;
          }
          /* Header with gradient */
          .header {
            background: linear-gradient(135deg, #059669 0%, #047857 50%, #065f46 100%);
            color: white;
            padding: 40px 50px;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: -50%;
            right: -10%;
            width: 400px;
            height: 400px;
            background: rgba(255,255,255,0.05);
            border-radius: 50%;
          }
          .header::after {
            content: '';
            position: absolute;
            bottom: -30%;
            left: -5%;
            width: 300px;
            height: 300px;
            background: rgba(255,255,255,0.03);
            border-radius: 50%;
          }
          .header-content {
            position: relative;
            z-index: 1;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          .header-left h1 {
            font-size: 32px;
            font-weight: 800;
            margin-bottom: 8px;
            letter-spacing: -0.5px;
          }
          .header-left .subtitle {
            font-size: 18px;
            opacity: 0.95;
            font-weight: 500;
            letter-spacing: 0.5px;
          }
          .header-right {
            text-align: right;
          }
          .header-right .doc-type {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 3px;
            opacity: 0.8;
            margin-bottom: 6px;
            font-weight: 600;
          }
          .header-right .doc-date {
            font-size: 15px;
            font-weight: 600;
          }

          /* Student Info Section */
          .student-section {
            padding: 35px 50px;
            background: linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%);
            border-bottom: 2px solid #d1fae5;
          }
          .student-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 30px;
          }
          .student-item {
            padding: 18px 22px;
            background: white;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          }
          .student-item label {
            display: block;
            font-size: 11px;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 8px;
            letter-spacing: 1px;
            font-weight: 700;
          }
          .student-item span {
            font-size: 17px;
            font-weight: 700;
            color: #111827;
            display: block;
          }

          /* Summary Section */
          .summary-section {
            padding: 35px 50px;
            background: #ffffff;
          }
          .summary-header {
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
          }
          .summary-header h2 {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 6px;
          }
          .summary-header p {
            font-size: 14px;
            color: #6b7280;
          }
          .summary-cards {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 25px;
          }
          .summary-card {
            padding: 28px;
            border-radius: 16px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .summary-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 5px;
          }
          .summary-card.total {
            background: linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%);
            border: 2px solid #bfdbfe;
          }
          .summary-card.total::before {
            background: linear-gradient(90deg, #3b82f6, #2563eb);
          }
          .summary-card.paid {
            background: linear-gradient(180deg, #f0fdf4 0%, #dcfce7 100%);
            border: 2px solid #bbf7d0;
          }
          .summary-card.paid::before {
            background: linear-gradient(90deg, #22c55e, #16a34a);
          }
          .summary-card.balance {
            background: linear-gradient(180deg, #fef2f2 0%, #fecaca 100%);
            border: 2px solid #fca5a5;
          }
          .summary-card.balance::before {
            background: linear-gradient(90deg, #ef4444, #dc2626);
          }
          .summary-card label {
            display: block;
            font-size: 13px;
            text-transform: uppercase;
            color: #6b7280;
            margin-bottom: 12px;
            letter-spacing: 1.5px;
            font-weight: 700;
          }
          .summary-card .amount {
            font-size: 32px;
            font-weight: 800;
            letter-spacing: -0.5px;
          }
          .summary-card.total .amount { color: #1d4ed8; }
          .summary-card.paid .amount { color: #15803d; }
          .summary-card.balance .amount { color: #b91c1c; }
          .summary-card .subtext {
            font-size: 12px;
            color: #6b7280;
            margin-top: 8px;
            font-weight: 500;
          }

          /* Progress Bar */
          .progress-section {
            margin-top: 30px;
            padding: 22px;
            background: #f9fafb;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
          }
          .progress-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;
          }
          .progress-header span {
            font-size: 14px;
            font-weight: 600;
            color: #374151;
          }
          .progress-header strong {
            font-size: 16px;
            font-weight: 800;
            color: ${paymentPercentage >= 100 ? '#16a34a' : paymentPercentage >= 50 ? '#f59e0b' : '#dc2626'};
          }
          .progress-bar {
            height: 14px;
            background: #e5e7eb;
            border-radius: 7px;
            overflow: hidden;
          }
          .progress-fill {
            height: 100%;
            width: ${paymentPercentage}%;
            background: linear-gradient(90deg, ${paymentPercentage >= 100 ? '#22c55e, #16a34a' : paymentPercentage >= 50 ? '#fbbf24, #f59e0b' : '#f87171, #dc2626'});
            border-radius: 7px;
            transition: width 0.3s ease;
          }

          /* Fee Table Section */
          .table-section {
            padding: 0 50px 35px;
            background: #ffffff;
            flex: 1;
          }
          .table-header {
            margin-bottom: 20px;
            padding-bottom: 15px;
            border-bottom: 2px solid #e5e7eb;
          }
          .table-header h2 {
            font-size: 20px;
            font-weight: 700;
            color: #111827;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            page-break-inside: auto;
          }
          thead {
            background: linear-gradient(180deg, #1f2937 0%, #111827 100%);
            display: table-header-group;
          }
          th {
            padding: 18px 20px;
            text-align: left;
            font-size: 12px;
            text-transform: uppercase;
            color: #ffffff;
            letter-spacing: 1px;
            font-weight: 700;
          }
          th:not(:first-child) { text-align: right; }
          th:nth-child(5) { text-align: center; }
          tbody tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          tbody tr:last-child td {
            border-bottom: none;
          }
          tfoot {
            display: table-footer-group;
            page-break-inside: avoid;
          }

          /* Table Footer */
          .table-footer {
            background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
            border-top: 3px solid #e5e7eb;
          }
          .table-footer td {
            padding: 20px !important;
            font-weight: 700 !important;
            font-size: 16px !important;
          }
          .table-footer .label {
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #374151;
          }

          /* Footer */
          .footer {
            padding: 30px 50px;
            background: linear-gradient(180deg, #f9fafb 0%, #f3f4f6 100%);
            border-top: 2px solid #e5e7eb;
            margin-top: auto;
          }
          .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .footer-left p {
            font-size: 13px;
            color: #6b7280;
            margin-bottom: 4px;
          }
          .footer-left .disclaimer {
            font-size: 11px;
            color: #9ca3af;
            font-style: italic;
          }
          .footer-right {
            text-align: right;
          }
          .footer-right .school-name {
            font-size: 15px;
            font-weight: 700;
            color: #059669;
            margin-bottom: 4px;
          }
          .footer-right .timestamp {
            font-size: 12px;
            color: #9ca3af;
          }

          /* Page break controls */
          .header, .student-section, .summary-section, .footer {
            page-break-inside: avoid;
          }
          .table-section {
            page-break-before: auto;
          }
          .summary-cards {
            page-break-inside: avoid;
          }
          .progress-section {
            page-break-inside: avoid;
          }

          @media print {
            html, body {
              width: 210mm;
              height: auto;
            }
            .page {
              page-break-after: auto;
            }
          }
        </style>
      </head>
      <body>
        <div class="page">
          <!-- Header -->
          <div class="header">
            <div class="header-content">
              <div class="header-left">
                <h1>${schoolName}</h1>
                <div class="subtitle">Student Fee Statement</div>
              </div>
              <div class="header-right">
                <div class="doc-type">Official Document</div>
                <div class="doc-date">${currentDate}</div>
              </div>
            </div>
          </div>

          <!-- Student Information -->
          <div class="student-section">
            <div class="student-grid">
              <div class="student-item">
                <label>Student Name</label>
                <span>${childName}</span>
              </div>
              <div class="student-item">
                <label>Class</label>
                <span>${childClass}</span>
              </div>
              <div class="student-item">
                <label>Term</label>
                <span>${term}</span>
              </div>
              <div class="student-item">
                <label>Academic Year</label>
                <span>${academicYear}</span>
              </div>
            </div>
          </div>

          <!-- Financial Summary -->
          <div class="summary-section">
            <div class="summary-header">
              <h2>Financial Summary</h2>
              <p>Overview of fee payments and outstanding balance</p>
            </div>
            <div class="summary-cards">
              <div class="summary-card total">
                <label>Total Fees</label>
                <div class="amount">${formatCurrency(totalAmount)}</div>
                <div class="subtext">All assessed fees</div>
              </div>
              <div class="summary-card paid">
                <label>Amount Paid</label>
                <div class="amount">${formatCurrency(totalPaid)}</div>
                <div class="subtext">Payments received</div>
              </div>
              <div class="summary-card balance">
                <label>Balance Due</label>
                <div class="amount">${formatCurrency(totalBalance)}</div>
                <div class="subtext">Outstanding amount</div>
              </div>
            </div>

            <!-- Payment Progress -->
            <div class="progress-section">
              <div class="progress-header">
                <span>Payment Progress</span>
                <strong>${paymentPercentage}% Complete</strong>
              </div>
              <div class="progress-bar">
                <div class="progress-fill"></div>
              </div>
            </div>
          </div>

          <!-- Fee Breakdown Table -->
          <div class="table-section">
            <div class="table-header">
              <h2>Fee Breakdown</h2>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Fee Description</th>
                  <th>Total Amount</th>
                  <th>Amount Paid</th>
                  <th>Balance</th>
                  <th>Status</th>
                  <th>Due Date</th>
                </tr>
              </thead>
              <tbody>
                ${feeRows}
              </tbody>
              <tfoot class="table-footer">
                <tr>
                  <td class="label">Grand Total</td>
                  <td style="text-align: right; color: #1d4ed8;">${formatCurrency(totalAmount)}</td>
                  <td style="text-align: right; color: #15803d;">${formatCurrency(totalPaid)}</td>
                  <td style="text-align: right; color: #b91c1c;">${formatCurrency(totalBalance)}</td>
                  <td colspan="2"></td>
                </tr>
              </tfoot>
            </table>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-content">
              <div class="footer-left">
                <p>This is a computer-generated statement and does not require a signature.</p>
                <p class="disclaimer">Please contact the school bursary for any discrepancies or queries.</p>
              </div>
              <div class="footer-right">
                <div class="school-name">${schoolName}</div>
                <div class="timestamp">Generated: ${currentDate} at ${currentTime}</div>
              </div>
            </div>
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
