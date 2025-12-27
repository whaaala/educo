import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { useTenantSettings } from '../../contexts/TenantSettingsContext';
import { PayFeesModal } from '../../components/modals/PayFeesModal';
import { ContactBursaryModal } from '../../components/modals/ContactBursaryModal';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { ChildSwitcher, type ChildData } from '../../components/ui/ChildSwitcher';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

// Color palette for stat tiles (matching dashboard)
const STAT_COLORS = {
  blue: { bg: '#eff6ff', border: '#bfdbfe', tint: '#2563eb', iconBg: '#dbeafe' },
  emerald: { bg: '#ecfdf5', border: '#a7f3d0', tint: '#059669', iconBg: '#d1fae5' },
  red: { bg: '#fef2f2', border: '#fecaca', tint: '#dc2626', iconBg: '#fee2e2' },
  amber: { bg: '#fffbeb', border: '#fde68a', tint: '#d97706', iconBg: '#fef3c7' },
};

// Mock children data - same as dashboard
const MOCK_CHILDREN: ChildData[] = [
  { id: 'child-001', name: 'Adaeze Okonkwo', classLevel: 'JSS 2', avatarUri: 'https://i.pravatar.cc/150?u=adaeze' },
  { id: 'child-002', name: 'Chukwuemeka Okonkwo', classLevel: 'SS 1', avatarUri: 'https://i.pravatar.cc/150?u=chukwuemeka' },
];

interface FeeRecord {
  id: string;
  childId: string;
  childName: string;
  childAvatar: string;
  feeType: string;
  term: string;
  academicYear: string;
  amount: number;
  paidAmount: number;
  balance: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

// Current term/year constants
const CURRENT_TERM = '2nd Term';
const CURRENT_YEAR = '2024/2025';

// Mock fee data - Current term fees only
const MOCK_CURRENT_FEES: FeeRecord[] = [
  // Child 1 - Current Term Fees
  {
    id: 'fee-001',
    childId: 'child-001',
    childName: 'Adaeze Okonkwo',
    childAvatar: 'https://i.pravatar.cc/150?u=adaeze',
    feeType: 'School Fees',
    term: '2nd Term',
    academicYear: '2024/2025',
    amount: 150000,
    paidAmount: 100000,
    balance: 50000,
    dueDate: '2024-02-15',
    status: 'partial',
  },
  {
    id: 'fee-002',
    childId: 'child-001',
    childName: 'Adaeze Okonkwo',
    childAvatar: 'https://i.pravatar.cc/150?u=adaeze',
    feeType: 'Bus Fee',
    term: '2nd Term',
    academicYear: '2024/2025',
    amount: 25000,
    paidAmount: 0,
    balance: 25000,
    dueDate: '2024-02-01',
    status: 'overdue',
  },
  {
    id: 'fee-003',
    childId: 'child-001',
    childName: 'Adaeze Okonkwo',
    childAvatar: 'https://i.pravatar.cc/150?u=adaeze',
    feeType: 'Exam Fee',
    term: '2nd Term',
    academicYear: '2024/2025',
    amount: 15000,
    paidAmount: 15000,
    balance: 0,
    dueDate: '2024-02-20',
    status: 'paid',
  },
  // Child 2 - Current Term Fees
  {
    id: 'fee-004',
    childId: 'child-002',
    childName: 'Chukwuemeka Okonkwo',
    childAvatar: 'https://i.pravatar.cc/150?u=chukwuemeka',
    feeType: 'School Fees',
    term: '2nd Term',
    academicYear: '2024/2025',
    amount: 180000,
    paidAmount: 180000,
    balance: 0,
    dueDate: '2024-02-15',
    status: 'paid',
  },
  {
    id: 'fee-005',
    childId: 'child-002',
    childName: 'Chukwuemeka Okonkwo',
    childAvatar: 'https://i.pravatar.cc/150?u=chukwuemeka',
    feeType: 'Exam Fee',
    term: '2nd Term',
    academicYear: '2024/2025',
    amount: 15000,
    paidAmount: 0,
    balance: 15000,
    dueDate: '2024-02-20',
    status: 'pending',
  },
  {
    id: 'fee-006',
    childId: 'child-002',
    childName: 'Chukwuemeka Okonkwo',
    childAvatar: 'https://i.pravatar.cc/150?u=chukwuemeka',
    feeType: 'Bus Fee',
    term: '2nd Term',
    academicYear: '2024/2025',
    amount: 25000,
    paidAmount: 25000,
    balance: 0,
    dueDate: '2024-02-01',
    status: 'paid',
  },
];

// Filter options - simplified for current fees
const STATUS_OPTIONS = ['All', 'Paid', 'Partial', 'Pending', 'Overdue'];

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Fee Card Component
function FeeCard({
  fee,
  colors,
  isDark,
  isTablet,
  currencySymbol,
  onPayNow,
}: {
  fee: FeeRecord;
  colors: any;
  isDark: boolean;
  isTablet: boolean;
  currencySymbol: string;
  onPayNow: (fee: FeeRecord) => void;
}) {
  const statusConfig = {
    paid: {
      label: 'Paid',
      bg: isDark ? colors.successLight : '#ecfdf5',
      text: isDark ? colors.success : '#059669',
      icon: 'checkmark-circle' as const,
    },
    partial: {
      label: 'Partial',
      bg: isDark ? colors.warningLight : '#fef3c7',
      text: isDark ? colors.warning : '#d97706',
      icon: 'time' as const,
    },
    pending: {
      label: 'Pending',
      bg: isDark ? colors.infoLight : '#eff6ff',
      text: isDark ? colors.info : '#3b82f6',
      icon: 'hourglass' as const,
    },
    overdue: {
      label: 'Overdue',
      bg: isDark ? colors.errorLight : '#fef2f2',
      text: isDark ? colors.error : '#dc2626',
      icon: 'alert-circle' as const,
    },
  };

  const status = statusConfig[fee.status];
  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  // Calculate progress percentage
  const progressPercent = fee.amount > 0 ? Math.round((fee.paidAmount / fee.amount) * 100) : 0;

  if (isTablet) {
    return (
      <View
        style={[
          styles.tabletFeeCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        {/* Left: Fee Type Info */}
        <View style={styles.tabletFeeCardLeft}>
          <View style={styles.tabletFeeChildInfo}>
            <View style={[styles.tabletFeeIconWrap, { backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }]}>
              <Ionicons name="receipt-outline" size={20} color={colors.primary} />
            </View>
            <View style={styles.tabletFeeInfo}>
              <Text style={[styles.tabletFeeChildName, { color: colors.text }]}>{fee.feeType}</Text>
              <Text style={[styles.tabletFeeType, { color: colors.textSecondary }]}>
                {fee.term}
              </Text>
            </View>
          </View>
        </View>

        {/* Middle: Amount Info with Progress */}
        <View style={styles.tabletFeeCardMiddle}>
          <View style={styles.tabletAmountRow}>
            <View style={styles.tabletAmountItem}>
              <Text style={[styles.tabletAmountLabel, { color: colors.textMuted }]}>Total</Text>
              <Text style={[styles.tabletAmountValue, { color: colors.text }]}>
                {formatCurrency(fee.amount)}
              </Text>
            </View>
            <View style={styles.tabletAmountItem}>
              <Text style={[styles.tabletAmountLabel, { color: colors.textMuted }]}>Paid</Text>
              <Text style={[styles.tabletAmountValue, { color: colors.success }]}>
                {formatCurrency(fee.paidAmount)}
              </Text>
            </View>
            <View style={styles.tabletAmountItem}>
              <Text style={[styles.tabletAmountLabel, { color: colors.textMuted }]}>Balance</Text>
              <Text
                style={[
                  styles.tabletAmountValue,
                  { color: fee.balance > 0 ? colors.error : colors.success },
                ]}
              >
                {formatCurrency(fee.balance)}
              </Text>
            </View>
          </View>
          {/* Progress Bar for Tablet */}
          <View style={styles.tabletProgressContainer}>
            <View style={[styles.tabletProgressBarBg, { backgroundColor: isDark ? colors.border : '#e2e8f0' }]}>
              <View
                style={[
                  styles.tabletProgressBarFill,
                  {
                    width: `${progressPercent}%`,
                    backgroundColor: fee.status === 'paid' ? colors.success : fee.status === 'overdue' ? colors.error : colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.tabletProgressText, { color: colors.textMuted }]}>
              {progressPercent}%
            </Text>
          </View>
          <View style={styles.tabletDueRow}>
            <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
            <Text style={[styles.tabletDueText, { color: colors.textMuted }]}>
              Due: {formatDate(fee.dueDate)}
            </Text>
          </View>
        </View>

        {/* Right: Status & Action */}
        <View style={styles.tabletFeeCardRight}>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Ionicons name={status.icon} size={10} color={status.text} />
            <Text style={[styles.statusBadgeText, { color: status.text }]}>{status.label}</Text>
          </View>
          {fee.balance > 0 && (
            <Pressable
              onPress={() => onPayNow(fee)}
              style={[styles.tabletPayButton, { backgroundColor: colors.success }]}
            >
              <Ionicons name="card" size={14} color="#fff" />
              <Text style={styles.tabletPayButtonText}>Pay Now</Text>
            </Pressable>
          )}
        </View>
      </View>
    );
  }

  // Mobile layout
  return (
    <View
      style={[
        styles.feeCard,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      {/* Header Row */}
      <View style={styles.feeCardHeader}>
        <View style={styles.feeChildInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.backgroundTertiary }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {fee.childName.charAt(0)}
            </Text>
          </View>
          <View style={styles.feeInfo}>
            <Text style={[styles.feeChildName, { color: colors.text }]} numberOfLines={1}>
              {fee.feeType}
            </Text>
            <Text style={[styles.feeType, { color: colors.textSecondary }]}>
              {fee.term}
            </Text>
          </View>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Ionicons name={status.icon} size={10} color={status.text} />
          <Text style={[styles.statusBadgeText, { color: status.text }]}>{status.label}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBarBg, { backgroundColor: isDark ? colors.border : '#e2e8f0' }]}>
          <View
            style={[
              styles.progressBarFill,
              {
                width: `${progressPercent}%`,
                backgroundColor: fee.status === 'paid' ? colors.success : fee.status === 'overdue' ? colors.error : colors.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.progressText, { color: colors.textMuted }]}>
          {progressPercent}% paid
        </Text>
      </View>

      {/* Amount Row */}
      <View style={styles.feeAmountRow}>
        <View style={styles.feeAmountItem}>
          <Text style={[styles.feeAmountLabel, { color: colors.textMuted }]}>Total</Text>
          <Text style={[styles.feeAmountValue, { color: colors.text }]}>
            {formatCurrency(fee.amount)}
          </Text>
        </View>
        <View style={styles.feeAmountItem}>
          <Text style={[styles.feeAmountLabel, { color: colors.textMuted }]}>Paid</Text>
          <Text style={[styles.feeAmountValue, { color: colors.success }]}>
            {formatCurrency(fee.paidAmount)}
          </Text>
        </View>
        <View style={styles.feeAmountItem}>
          <Text style={[styles.feeAmountLabel, { color: colors.textMuted }]}>Balance</Text>
          <Text
            style={[
              styles.feeAmountValue,
              { color: fee.balance > 0 ? colors.error : colors.success },
            ]}
          >
            {formatCurrency(fee.balance)}
          </Text>
        </View>
      </View>

      {/* Footer Row */}
      <View style={styles.feeCardFooter}>
        <View style={styles.feeDueRow}>
          <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
          <Text style={[styles.feeDueText, { color: colors.textMuted }]}>
            Due: {formatDate(fee.dueDate)}
          </Text>
        </View>
        {fee.balance > 0 && (
          <Pressable
            onPress={() => onPayNow(fee)}
            style={[styles.payButton, { backgroundColor: colors.success }]}
          >
            <Ionicons name="card" size={12} color="#fff" />
            <Text style={styles.payButtonText}>Pay Now</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

// Stat Tile Component (matching dashboard design)
function StatTile({
  label,
  value,
  icon,
  colorScheme,
  badge,
  isTablet,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  colorScheme: 'blue' | 'emerald' | 'red' | 'amber';
  badge?: string;
  isTablet: boolean;
}) {
  const { colors, isDark } = useTheme();
  const scheme = STAT_COLORS[colorScheme];
  const tileBg = isDark ? colors.surface : scheme.bg;
  const tileBorder = isDark ? colors.border : scheme.border;

  return (
    <View style={[
      isTablet ? styles.tabletStatTile : styles.statTile,
      { backgroundColor: tileBg, borderColor: tileBorder }
    ]}>
      {badge && (
        <View style={[styles.tileBadge, { backgroundColor: isDark ? colors.errorLight : '#fef2f2' }]}>
          <Text style={[styles.tileBadgeText, { color: isDark ? colors.error : '#dc2626' }]}>{badge}</Text>
        </View>
      )}
      <View style={styles.statTileTop}>
        <Text style={[styles.statTileLabel, { color: isDark ? colors.textSecondary : '#64748b' }]}>{label}</Text>
        <View style={[styles.statTileIconWrap, { backgroundColor: isDark ? `${scheme.tint}20` : scheme.iconBg }]}>
          <Ionicons name={icon} size={isTablet ? 16 : 14} color={scheme.tint} />
        </View>
      </View>
      <Text style={[
        isTablet ? styles.tabletStatTileValue : styles.statTileValue,
        { color: colors.text }
      ]} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

export default function FeesScreen() {
  const { colors, isDark } = useTheme();
  const { settings } = useTenantSettings();
  const { currencySymbol } = settings;
  const router = useRouter();
  const params = useLocalSearchParams();
  const isTablet = useIsTablet();

  // Get selected child from params or default to first child
  const initialChildId = (params.childId as string) || MOCK_CHILDREN[0]?.id || '';
  const [selectedChildId, setSelectedChildId] = useState(initialChildId);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [showPayModal, setShowPayModal] = useState(false);
  const [selectedFeeForPayment, setSelectedFeeForPayment] = useState<FeeRecord | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [showContactBursaryModal, setShowContactBursaryModal] = useState(false);

  const selectedChild = MOCK_CHILDREN.find((c) => c.id === selectedChildId) || MOCK_CHILDREN[0];

  // Filter current term fees by selected child and status
  const filteredFees = MOCK_CURRENT_FEES.filter((fee) => {
    const matchesChild = fee.childId === selectedChildId;
    const matchesStatus =
      selectedStatus === 'All' || fee.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      fee.feeType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesChild && matchesStatus && matchesSearch;
  });

  // Calculate stats for selected child (current term only)
  const childFees = MOCK_CURRENT_FEES.filter((f) => f.childId === selectedChildId);
  const stats = {
    totalAmount: childFees.reduce((sum, f) => sum + f.amount, 0),
    totalPaid: childFees.reduce((sum, f) => sum + f.paidAmount, 0),
    totalBalance: childFees.reduce((sum, f) => sum + f.balance, 0),
    overdueCount: childFees.filter((f) => f.status === 'overdue').length,
  };

  const formatCurrency = (amount: number) => `${currencySymbol}${amount.toLocaleString()}`;

  const handlePayNow = (fee: FeeRecord) => {
    setSelectedFeeForPayment(fee);
    setShowPayModal(true);
  };

  // Get all outstanding fees for the selected child (fees with balance > 0)
  const outstandingFeesForChild = childFees.filter((f) => f.balance > 0);

  const handlePayAllOutstanding = () => {
    // Set to a special marker to indicate "pay all outstanding"
    setSelectedFeeForPayment(null);
    setShowPayModal(true);
  };

  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters(!showFilters);
    setOpenDropdown(null);
  };

  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    // Reset filters when switching child
    setSelectedStatus('All');
    setSearchQuery('');
  };

  const clearAllFilters = () => {
    setSelectedStatus('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedStatus !== 'All' || searchQuery.length > 0;
  const activeFilterCount = selectedStatus !== 'All' ? 1 : 0;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: isTablet ? 24 : 20 },
        ]}
        showsVerticalScrollIndicator={false}
        onTouchStart={() => openDropdown && setOpenDropdown(null)}
      >
        {/* Header with Back Button */}
        <View style={[styles.headerSection, isTablet && styles.tabletHeaderSection]}>
          {/* Top Row: Back + Title */}
          <View style={[styles.topRow, isTablet && styles.tabletTopRow]}>
            <Pressable
              onPress={() => router.back()}
              style={[styles.backButton, { backgroundColor: colors.backgroundTertiary }]}
            >
              <Ionicons name="arrow-back" size={20} color={colors.text} />
            </Pressable>
            <Text style={[styles.pageTitle, isTablet && styles.tabletPageTitle, { color: colors.text }]}>
              Fees & Payments
            </Text>
            <Pressable
              onPress={() => router.push('/payment-history')}
              style={[styles.historyButton, { backgroundColor: colors.surface, borderColor: colors.border }]}
            >
              <Ionicons name="receipt-outline" size={isTablet ? 18 : 16} color={colors.primary} />
              {isTablet && (
                <Text style={[styles.historyButtonText, { color: colors.primary }]}>History</Text>
              )}
            </Pressable>
          </View>

          {/* Profile Row with Avatar and Child Switcher */}
          <View style={[styles.profileRow, isTablet && styles.tabletProfileRow]}>
            {/* Avatar with gradient ring */}
            <ProfileAvatar
              imageUri={selectedChild?.avatarUri}
              name={selectedChild?.name}
              size={isTablet ? 'lg' : 'md'}
              gradient="green"
              enlargeOnPress
            />

            {/* Name and Class */}
            <View style={styles.profileInfo}>
              <Text style={[styles.profileName, isTablet && styles.tabletProfileName, { color: colors.text }]}>
                {selectedChild?.name}
              </Text>
              <View style={[styles.classBadge, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="school" size={isTablet ? 13 : 12} color={colors.primary} />
                <Text style={[styles.classBadgeText, { color: colors.primary }]}>
                  {selectedChild?.classLevel}
                </Text>
              </View>
            </View>

            {/* Child Switcher - Only show if multiple children */}
            {MOCK_CHILDREN.length > 1 && (
              <View style={styles.childSwitcherContainer}>
                <ChildSwitcher
                  children={MOCK_CHILDREN}
                  selectedChildId={selectedChildId}
                  onSelectChild={handleSelectChild}
                  variant="compact"
                  showClass
                />
              </View>
            )}
          </View>

          {/* Outstanding Balance Card - Modern Design */}
          {stats.totalBalance > 0 && (
            <View style={[styles.outstandingCard, isTablet && styles.tabletOutstandingCard, { backgroundColor: isDark ? colors.surface : '#fafafa', borderColor: isDark ? colors.border : '#f0f0f0' }]}>
              <View style={styles.outstandingContent}>
                <View style={styles.outstandingLeft}>
                  <View style={[styles.outstandingIconWrap, { backgroundColor: isDark ? '#3f1515' : '#fef2f2' }]}>
                    <Ionicons name="wallet-outline" size={isTablet ? 22 : 18} color={isDark ? '#f87171' : '#ef4444'} />
                  </View>
                  <View style={styles.outstandingTextWrap}>
                    <Text style={[styles.outstandingLabel, { color: colors.textSecondary }]}>Outstanding Balance</Text>
                    <Text style={[styles.outstandingAmount, isTablet && styles.tabletOutstandingAmount, { color: isDark ? '#f87171' : '#dc2626' }]}>
                      {formatCurrency(stats.totalBalance)}
                    </Text>
                  </View>
                </View>
                <Pressable
                  onPress={handlePayAllOutstanding}
                  style={[styles.outstandingPayButton, { backgroundColor: isDark ? '#dc2626' : '#ef4444' }]}
                >
                  <Ionicons name="card-outline" size={isTablet ? 16 : 14} color="#fff" />
                  <Text style={[styles.outstandingPayButtonText, isTablet && styles.tabletOutstandingPayButtonText]}>Pay Now</Text>
                </Pressable>
              </View>
              {stats.overdueCount > 0 && (
                <View style={[styles.overdueWarning, { backgroundColor: isDark ? '#3f1515' : '#fef2f2' }]}>
                  <Ionicons name="warning-outline" size={14} color={isDark ? '#fca5a5' : '#dc2626'} />
                  <Text style={[styles.overdueWarningText, { color: isDark ? '#fca5a5' : '#dc2626' }]}>
                    {stats.overdueCount} overdue {stats.overdueCount === 1 ? 'fee' : 'fees'} - please pay soon to avoid penalties
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Stats Summary Cards - Dashboard style */}
        <View style={[styles.statsSection, isTablet && styles.tabletStatsSection]}>
          {isTablet ? (
            /* Tablet: Single row layout */
            <View style={styles.tabletStatsRow}>
              <StatTile
                label="Total Fees"
                value={formatCurrency(stats.totalAmount)}
                icon="cash-outline"
                colorScheme="blue"
                isTablet={isTablet}
              />
              <StatTile
                label="Total Paid"
                value={formatCurrency(stats.totalPaid)}
                icon="checkmark-circle-outline"
                colorScheme="emerald"
                isTablet={isTablet}
              />
              <StatTile
                label="Outstanding"
                value={formatCurrency(stats.totalBalance)}
                icon="time-outline"
                colorScheme={stats.totalBalance > 0 ? 'red' : 'emerald'}
                isTablet={isTablet}
              />
              <StatTile
                label="Overdue"
                value={stats.overdueCount.toString()}
                icon="alert-circle-outline"
                colorScheme={stats.overdueCount > 0 ? 'amber' : 'emerald'}
                badge={stats.overdueCount > 0 ? '!' : undefined}
                isTablet={isTablet}
              />
            </View>
          ) : (
            /* Mobile: 2x2 grid layout */
            <View style={styles.mobileStatsGrid}>
              <View style={styles.mobileStatsRow}>
                <StatTile
                  label="Total Fees"
                  value={formatCurrency(stats.totalAmount)}
                  icon="cash-outline"
                  colorScheme="blue"
                  isTablet={false}
                />
                <StatTile
                  label="Total Paid"
                  value={formatCurrency(stats.totalPaid)}
                  icon="checkmark-circle-outline"
                  colorScheme="emerald"
                  isTablet={false}
                />
              </View>
              <View style={styles.mobileStatsRow}>
                <StatTile
                  label="Outstanding"
                  value={formatCurrency(stats.totalBalance)}
                  icon="time-outline"
                  colorScheme={stats.totalBalance > 0 ? 'red' : 'emerald'}
                  isTablet={false}
                />
                <StatTile
                  label="Overdue"
                  value={stats.overdueCount.toString()}
                  icon="alert-circle-outline"
                  colorScheme={stats.overdueCount > 0 ? 'amber' : 'emerald'}
                  badge={stats.overdueCount > 0 ? '!' : undefined}
                  isTablet={false}
                />
              </View>
            </View>
          )}
        </View>

        {/* Search & Filters - Tablet inline, Mobile stacked */}
        {isTablet ? (
          <View style={styles.tabletSearchFilterContainer}>
            {/* Search Input */}
            <View style={[styles.tabletSearchInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.searchIconWrap, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="search" size={14} color={colors.primary} />
              </View>
              <TextInput
                style={[styles.searchInputField, { color: colors.text }]}
                placeholder="Search fees..."
                placeholderTextColor={colors.textMuted}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <Pressable onPress={() => setSearchQuery('')} style={[styles.searchClearButton, { backgroundColor: colors.backgroundTertiary }]}>
                  <Ionicons name="close" size={14} color={colors.textMuted} />
                </Pressable>
              )}
            </View>

            {/* Filter Chips */}
            <View style={styles.tabletFilterChips}>
              {/* Status Filter */}
              <View style={styles.tabletFilterChipWrapper}>
                <Pressable
                  style={[
                    styles.tabletFilterChip,
                    {
                      backgroundColor: selectedStatus !== 'All' ? colors.primaryLight : colors.surface,
                      borderColor: selectedStatus !== 'All' ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                >
                  <Ionicons name="funnel-outline" size={16} color={selectedStatus !== 'All' ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.tabletFilterChipText, { color: selectedStatus !== 'All' ? colors.primary : colors.text }]}>
                    {selectedStatus === 'All' ? 'Status' : selectedStatus}
                  </Text>
                  <Ionicons name={openDropdown === 'status' ? 'chevron-up' : 'chevron-down'} size={14} color={selectedStatus !== 'All' ? colors.primary : colors.textMuted} />
                </Pressable>
                {openDropdown === 'status' && (
                  <View style={[styles.tabletDropdownMenuRight, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {STATUS_OPTIONS.map((option, idx) => (
                      <Pressable
                        key={option}
                        style={[styles.tabletDropdownOption, selectedStatus === option && { backgroundColor: colors.primaryLight }, idx === 0 && styles.tabletDropdownOptionFirst]}
                        onPress={() => { setSelectedStatus(option); setOpenDropdown(null); }}
                      >
                        <Text style={[styles.tabletDropdownOptionText, { color: selectedStatus === option ? colors.primary : colors.text }]}>{option}</Text>
                        {selectedStatus === option && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Clear Filters */}
              {hasActiveFilters && (
                <Pressable
                  style={[styles.tabletClearFilters, { backgroundColor: colors.backgroundTertiary }]}
                  onPress={clearAllFilters}
                >
                  <Ionicons name="close" size={16} color={colors.textSecondary} />
                  <Text style={[styles.tabletClearFiltersText, { color: colors.textSecondary }]}>Clear</Text>
                </Pressable>
              )}
            </View>
          </View>
        ) : (
          /* Mobile Search & Filters */
          <>
            <View style={styles.mobileSearchFilterRow}>
              <View style={[styles.mobileSearchInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.searchIconWrap, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="search" size={14} color={colors.primary} />
                </View>
                <TextInput
                  style={[styles.searchInputField, { color: colors.text }]}
                  placeholder="Search fees..."
                  placeholderTextColor={colors.textMuted}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <Pressable onPress={() => setSearchQuery('')} style={[styles.searchClearButton, { backgroundColor: colors.backgroundTertiary }]}>
                    <Ionicons name="close" size={14} color={colors.textMuted} />
                  </Pressable>
                )}
              </View>
              <Pressable
                style={[
                  styles.filterToggleButton,
                  {
                    backgroundColor: showFilters || activeFilterCount > 0 ? colors.primary : colors.surface,
                    borderColor: showFilters || activeFilterCount > 0 ? colors.primary : colors.border
                  }
                ]}
                onPress={toggleFilters}
              >
                <Ionicons name="options-outline" size={18} color={showFilters || activeFilterCount > 0 ? '#ffffff' : colors.text} />
                {activeFilterCount > 0 && (
                  <View style={styles.filterCountBadge}>
                    <Text style={styles.filterCountText}>{activeFilterCount}</Text>
                  </View>
                )}
              </Pressable>
            </View>

            {/* Mobile Filter Panel */}
            {showFilters && (
              <View style={[styles.mobileFilterPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.filterPanelHeader}>
                  <Text style={[styles.filterPanelTitle, { color: colors.text }]}>Filter by</Text>
                  {hasActiveFilters && (
                    <Pressable
                      onPress={clearAllFilters}
                      style={[styles.clearFiltersButton, { backgroundColor: colors.backgroundTertiary }]}
                    >
                      <Ionicons name="refresh-outline" size={14} color={colors.textSecondary} />
                      <Text style={[styles.clearFiltersText, { color: colors.textSecondary }]}>Clear all</Text>
                    </Pressable>
                  )}
                </View>

                {/* Status Filter Dropdown */}
                <View style={styles.mobileFilterDropdown}>
                  <Pressable
                    onPress={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                    style={[
                      styles.mobileDropdownButton,
                      {
                        backgroundColor: openDropdown === 'status' ? colors.primaryLight : colors.backgroundTertiary,
                        borderColor: openDropdown === 'status' ? colors.primary : 'transparent',
                      }
                    ]}
                  >
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.mobileDropdownLabel, { color: colors.textMuted }]}>Status</Text>
                      <Text style={[styles.mobileDropdownValue, { color: selectedStatus !== 'All' ? colors.primary : colors.text }]}>{selectedStatus}</Text>
                    </View>
                    <View style={[styles.mobileDropdownIcon, { backgroundColor: openDropdown === 'status' ? colors.primary : colors.border + '60' }]}>
                      <Ionicons name={openDropdown === 'status' ? 'chevron-up' : 'chevron-down'} size={14} color={openDropdown === 'status' ? '#ffffff' : colors.textMuted} />
                    </View>
                  </Pressable>
                  {openDropdown === 'status' && (
                    <View style={[styles.mobileDropdownMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                      {STATUS_OPTIONS.map((option, idx) => (
                        <Pressable
                          key={option}
                          onPress={() => { setSelectedStatus(option); setOpenDropdown(null); }}
                          style={[
                            styles.mobileDropdownOption,
                            { backgroundColor: selectedStatus === option ? colors.primaryLight : 'transparent', borderTopWidth: idx > 0 ? 1 : 0, borderTopColor: colors.border }
                          ]}
                        >
                          <Text style={[styles.mobileDropdownOptionText, { color: selectedStatus === option ? colors.primary : colors.text }]}>{option}</Text>
                          {selectedStatus === option && (
                            <View style={[styles.mobileDropdownCheck, { backgroundColor: colors.primary }]}>
                              <Ionicons name="checkmark" size={12} color="#ffffff" />
                            </View>
                          )}
                        </Pressable>
                      ))}
                    </View>
                  )}
                </View>
              </View>
            )}
          </>
        )}

        {/* Current Term Fees */}
        <View style={[styles.feesList, isTablet && styles.tabletFeesList]}>
          {/* Current Term Header */}
          <View style={[styles.currentTermHeader, { backgroundColor: isDark ? colors.backgroundTertiary : '#f8fafc', borderColor: colors.border }]}>
            <View style={[styles.currentTermIconWrap, { backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }]}>
              <Ionicons name="calendar" size={isTablet ? 18 : 16} color={colors.primary} />
            </View>
            <View style={styles.currentTermInfo}>
              <Text style={[styles.currentTermTitle, isTablet && styles.tabletCurrentTermTitle, { color: colors.text }]}>
                {CURRENT_TERM} - {CURRENT_YEAR}
              </Text>
              <Text style={[styles.currentTermSubtitle, { color: colors.textSecondary }]}>
                Current Term Fees
              </Text>
            </View>
            <View style={[styles.currentTermBadge, { backgroundColor: isDark ? colors.surface : '#e2e8f0' }]}>
              <Text style={[styles.currentTermBadgeText, { color: colors.textSecondary }]}>
                {filteredFees.length} {filteredFees.length === 1 ? 'fee' : 'fees'}
              </Text>
            </View>
          </View>

          {/* Fee Cards */}
          {filteredFees.length > 0 ? (
            <View style={styles.feesContainer}>
              {filteredFees.map((fee) => (
                <FeeCard
                  key={fee.id}
                  fee={fee}
                  colors={colors}
                  isDark={isDark}
                  isTablet={isTablet}
                  currencySymbol={currencySymbol}
                  onPayNow={handlePayNow}
                />
              ))}
            </View>
          ) : (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No fees found</Text>
              <Text style={[styles.emptyStateSubtitle, { color: colors.textMuted }]}>
                {hasActiveFilters ? 'Try adjusting your filters' : 'No fees for this term'}
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions Section */}
        <View style={[styles.quickActionsSection, isTablet && styles.tabletQuickActionsSection]}>
          {isTablet ? (
            /* Tablet: Modern horizontal cards with gradient accent */
            <View style={styles.tabletQuickActionsContainer}>
              <View style={styles.tabletQuickActionsHeader}>
                <Text style={[styles.tabletQuickActionsTitle, { color: colors.text }]}>Quick Actions</Text>
                <Text style={[styles.tabletQuickActionsSubtitle, { color: colors.textMuted }]}>Get help & manage payments</Text>
              </View>
              <View style={styles.tabletQuickActionsGrid}>
                {/* Contact Bursary Card */}
                <Pressable
                  style={[styles.tabletQuickActionCardModern, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => setShowContactBursaryModal(true)}
                >
                  <View style={[styles.tabletQuickActionAccent, { backgroundColor: '#2563eb' }]} />
                  <View style={styles.tabletQuickActionContent}>
                    <View style={[styles.tabletQuickActionIconModern, { backgroundColor: isDark ? '#1e3a5f' : '#dbeafe' }]}>
                      <Ionicons name="call" size={20} color={isDark ? '#60a5fa' : '#2563eb'} />
                    </View>
                    <Text style={[styles.tabletQuickActionTitleModern, { color: colors.text }]}>Contact Bursary</Text>
                    <Text style={[styles.tabletQuickActionDescModern, { color: colors.textMuted }]}>Call or email</Text>
                  </View>
                </Pressable>

                {/* Payment History Card */}
                <Pressable
                  style={[styles.tabletQuickActionCardModern, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => router.push('/payment-history')}
                >
                  <View style={[styles.tabletQuickActionAccent, { backgroundColor: '#059669' }]} />
                  <View style={styles.tabletQuickActionContent}>
                    <View style={[styles.tabletQuickActionIconModern, { backgroundColor: isDark ? '#1e3a3a' : '#d1fae5' }]}>
                      <Ionicons name="time" size={20} color={isDark ? '#34d399' : '#059669'} />
                    </View>
                    <Text style={[styles.tabletQuickActionTitleModern, { color: colors.text }]}>Payment History</Text>
                    <Text style={[styles.tabletQuickActionDescModern, { color: colors.textMuted }]}>View transactions</Text>
                  </View>
                </Pressable>

                {/* Download Statement Card */}
                <Pressable
                  style={[styles.tabletQuickActionCardModern, { backgroundColor: colors.surface, borderColor: colors.border }]}
                  onPress={() => {/* Handle download */}}
                >
                  <View style={[styles.tabletQuickActionAccent, { backgroundColor: '#d97706' }]} />
                  <View style={styles.tabletQuickActionContent}>
                    <View style={[styles.tabletQuickActionIconModern, { backgroundColor: isDark ? '#3f2f1f' : '#fef3c7' }]}>
                      <Ionicons name="download" size={20} color={isDark ? '#fbbf24' : '#d97706'} />
                    </View>
                    <Text style={[styles.tabletQuickActionTitleModern, { color: colors.text }]}>Download Statement</Text>
                    <Text style={[styles.tabletQuickActionDescModern, { color: colors.textMuted }]}>Export breakdown</Text>
                  </View>
                </Pressable>
              </View>
            </View>
          ) : (
            /* Mobile: Compact card with action items */
            <View style={[styles.quickActionsCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.quickActionsHeader}>
                <View style={[styles.quickActionsIconWrap, { backgroundColor: isDark ? colors.primaryLight : '#eff6ff' }]}>
                  <Ionicons name="help-buoy-outline" size={18} color={colors.primary} />
                </View>
                <View style={styles.quickActionsHeaderText}>
                  <Text style={[styles.quickActionsTitle, { color: colors.text }]}>Need Help?</Text>
                  <Text style={[styles.quickActionsSubtitle, { color: colors.textSecondary }]}>Quick actions & support</Text>
                </View>
              </View>
              <View style={styles.mobileQuickActionsButtons}>
                <Pressable
                  style={[styles.mobileQuickActionButton, { backgroundColor: isDark ? colors.backgroundTertiary : '#f8fafc' }]}
                  onPress={() => setShowContactBursaryModal(true)}
                >
                  <View style={[styles.mobileQuickActionIcon, { backgroundColor: isDark ? '#1e3a5f' : '#dbeafe' }]}>
                    <Ionicons name="call-outline" size={16} color={isDark ? '#60a5fa' : '#2563eb'} />
                  </View>
                  <Text style={[styles.mobileQuickActionLabel, { color: colors.text }]}>Contact{'\n'}Bursary</Text>
                </Pressable>
                <Pressable
                  style={[styles.mobileQuickActionButton, { backgroundColor: isDark ? colors.backgroundTertiary : '#f8fafc' }]}
                  onPress={() => router.push('/payment-history')}
                >
                  <View style={[styles.mobileQuickActionIcon, { backgroundColor: isDark ? '#1e3a3a' : '#d1fae5' }]}>
                    <Ionicons name="time-outline" size={16} color={isDark ? '#34d399' : '#059669'} />
                  </View>
                  <Text style={[styles.mobileQuickActionLabel, { color: colors.text }]}>Payment{'\n'}History</Text>
                </Pressable>
                <Pressable
                  style={[styles.mobileQuickActionButton, { backgroundColor: isDark ? colors.backgroundTertiary : '#f8fafc' }]}
                  onPress={() => {/* Handle download */}}
                >
                  <View style={[styles.mobileQuickActionIcon, { backgroundColor: isDark ? '#3f2f1f' : '#fef3c7' }]}>
                    <Ionicons name="download-outline" size={16} color={isDark ? '#fbbf24' : '#d97706'} />
                  </View>
                  <Text style={[styles.mobileQuickActionLabel, { color: colors.text }]}>Download{'\n'}Statement</Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>

      </ScrollView>

      {/* Pay Fees Modal - Updated */}
      <PayFeesModal
        visible={showPayModal}
        onClose={() => { setShowPayModal(false); setSelectedFeeForPayment(null); }}
        childName={selectedFeeForPayment?.childName || selectedChild?.name}
        fees={selectedFeeForPayment
          ? [{
              id: selectedFeeForPayment.id,
              name: selectedFeeForPayment.feeType,
              amount: selectedFeeForPayment.balance,
              dueDate: selectedFeeForPayment.dueDate,
              status: selectedFeeForPayment.status === 'paid' ? 'pending' : selectedFeeForPayment.status as 'pending' | 'overdue' | 'partial',
              paidAmount: selectedFeeForPayment.paidAmount,
            }]
          : outstandingFeesForChild.map((f) => ({
              id: f.id,
              name: f.feeType,
              amount: f.balance,
              dueDate: f.dueDate,
              status: f.status === 'paid' ? 'pending' : f.status as 'pending' | 'overdue' | 'partial',
              paidAmount: f.paidAmount,
            }))
        }
      />

      {/* Contact Bursary Modal */}
      <ContactBursaryModal
        visible={showContactBursaryModal}
        onClose={() => setShowContactBursaryModal(false)}
        schoolName="Greenfield Academy"
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 100 },

  // Header Section
  headerSection: { paddingHorizontal: 16, paddingTop: 8 },
  tabletHeaderSection: { paddingHorizontal: 20, paddingTop: 12 },

  // Top Row with Back Button
  topRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  tabletTopRow: { marginBottom: 20 },
  backButton: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  pageTitle: { flex: 1, fontSize: 17, fontFamily: FONTS.bold },
  tabletPageTitle: { fontSize: 20 },
  historyButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, gap: 6 },
  historyButtonText: { fontSize: 13, fontFamily: FONTS.semiBold },

  // Profile Row
  profileRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  tabletProfileRow: { marginBottom: 20 },
  profileInfo: { flex: 1, marginLeft: 12 },
  profileName: { fontSize: 18, fontFamily: FONTS.bold, marginBottom: 4 },
  tabletProfileName: { fontSize: 22 },
  classBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, alignSelf: 'flex-start', gap: 5 },
  classBadgeText: { fontSize: 12, fontFamily: FONTS.semiBold },
  childSwitcherContainer: { marginLeft: 12, maxWidth: 180 },

  // Outstanding Card
  outstandingCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  tabletOutstandingCard: { padding: 20, marginBottom: 20 },
  outstandingContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  outstandingLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  outstandingIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  outstandingTextWrap: { flex: 1 },
  outstandingLabel: { fontSize: 12, fontFamily: FONTS.medium, marginBottom: 2 },
  outstandingAmount: { fontSize: 20, fontFamily: FONTS.bold },
  tabletOutstandingAmount: { fontSize: 24 },
  outstandingPayButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 6 },
  outstandingPayButtonText: { fontSize: 13, fontFamily: FONTS.semiBold, color: '#fff' },
  tabletOutstandingPayButtonText: { fontSize: 14 },
  overdueWarning: { flexDirection: 'row', alignItems: 'center', marginTop: 12, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 8 },
  overdueWarningText: { fontSize: 12, fontFamily: FONTS.medium, flex: 1 },

  // Stats Section - Dashboard style
  statsSection: { paddingHorizontal: 16, marginBottom: 16 },
  tabletStatsSection: { paddingHorizontal: 20, marginBottom: 20 },

  // Mobile: 2x2 grid layout (matching dashboard)
  mobileStatsGrid: { gap: 8 },
  mobileStatsRow: { flexDirection: 'row', gap: 8 },

  // Tablet: Single row layout
  tabletStatsRow: { flexDirection: 'row', gap: 12 },

  // StatTile styles (matching dashboard)
  statTile: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 80,
  },
  tabletStatTile: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  statTileTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statTileLabel: { fontSize: 10, fontFamily: FONTS.semiBold },
  statTileIconWrap: {
    height: 26,
    width: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statTileValue: { marginTop: 4, fontSize: 18, fontFamily: FONTS.bold },
  tabletStatTileValue: { marginTop: 8, fontSize: 20, fontFamily: FONTS.bold },
  tileBadge: { position: 'absolute', top: 8, right: 8, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  tileBadgeText: { fontSize: 10, fontFamily: FONTS.bold },

  // Search & Filters - Tablet
  tabletSearchFilterContainer: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 16, gap: 12 },
  tabletSearchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  searchIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  searchInputField: { flex: 1, fontSize: 14, fontFamily: FONTS.medium, marginLeft: 10, paddingVertical: 0 },
  searchClearButton: { width: 26, height: 26, borderRadius: 13, alignItems: 'center', justifyContent: 'center' },
  tabletFilterChips: { flexDirection: 'row', gap: 8 },
  tabletFilterChipWrapper: { position: 'relative', zIndex: 100 },
  tabletFilterChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, borderWidth: 1, gap: 6 },
  tabletFilterChipText: { fontSize: 13, fontFamily: FONTS.medium },
  tabletDropdownMenuRight: { position: 'absolute', top: '100%', right: 0, marginTop: 4, borderRadius: 12, borderWidth: 1, overflow: 'hidden', minWidth: 160, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 6, zIndex: 1000 },
  tabletDropdownOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingVertical: 12 },
  tabletDropdownOptionFirst: { borderTopLeftRadius: 12, borderTopRightRadius: 12 },
  tabletDropdownOptionText: { fontSize: 14, fontFamily: FONTS.medium },
  tabletClearFilters: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 10, gap: 4 },
  tabletClearFiltersText: { fontSize: 13, fontFamily: FONTS.medium },

  // Search & Filters - Mobile
  mobileSearchFilterRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12, gap: 10 },
  mobileSearchInput: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  filterToggleButton: { width: 46, height: 46, borderRadius: 12, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  filterCountBadge: { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: '#ef4444', alignItems: 'center', justifyContent: 'center' },
  filterCountText: { fontSize: 10, fontFamily: FONTS.bold, color: '#fff' },
  mobileFilterPanel: { marginHorizontal: 16, marginBottom: 12, padding: 14, borderRadius: 14, borderWidth: 1 },
  filterPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  filterPanelTitle: { fontSize: 14, fontFamily: FONTS.semiBold },
  clearFiltersButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 4 },
  clearFiltersText: { fontSize: 12, fontFamily: FONTS.medium },
  mobileFilterDropdown: { marginBottom: 8 },
  mobileDropdownButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, borderWidth: 1.5, minHeight: 54 },
  mobileDropdownLabel: { fontSize: 10, fontFamily: FONTS.semiBold, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 },
  mobileDropdownValue: { fontSize: 14, fontFamily: FONTS.semiBold },
  mobileDropdownIcon: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  mobileDropdownMenu: { marginTop: 8, borderRadius: 12, borderWidth: 1, overflow: 'hidden' },
  mobileDropdownOption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  mobileDropdownOptionText: { fontSize: 14, fontFamily: FONTS.medium },
  mobileDropdownCheck: { width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },

  // Fee List
  feesList: { paddingHorizontal: 16, marginBottom: 16, gap: 10 },
  tabletFeesList: { paddingHorizontal: 20, marginBottom: 20, gap: 12 },
  feesListHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  sectionTitle: { fontSize: 16, fontFamily: FONTS.semiBold },
  tabletSectionTitle: { fontSize: 18 },
  feesCount: { fontSize: 12, fontFamily: FONTS.medium },

  // Current Term Header Styles
  currentTermHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderRadius: 12, borderWidth: 1, marginBottom: 12 },
  currentTermIconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  currentTermInfo: { flex: 1 },
  currentTermTitle: { fontSize: 15, fontFamily: FONTS.bold },
  tabletCurrentTermTitle: { fontSize: 17 },
  currentTermSubtitle: { fontSize: 11, fontFamily: FONTS.medium, marginTop: 2 },
  currentTermBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  currentTermBadgeText: { fontSize: 11, fontFamily: FONTS.semiBold },
  feesContainer: { gap: 10 },

  // Fee Card
  feeCard: { padding: 12, borderRadius: 12, borderWidth: 1 },
  tabletFeeCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, borderWidth: 1 },
  feeCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 },
  feeChildInfo: { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 },
  tabletFeeChildInfo: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  tabletAvatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 14, fontFamily: FONTS.bold },
  tabletAvatarText: { fontSize: 16, fontFamily: FONTS.bold },
  feeInfo: { flex: 1 },
  tabletFeeInfo: {},
  feeChildName: { fontSize: 14, fontFamily: FONTS.semiBold, marginBottom: 2 },
  tabletFeeChildName: { fontSize: 15, fontFamily: FONTS.semiBold, marginBottom: 2 },
  feeType: { fontSize: 11, fontFamily: FONTS.medium },
  tabletFeeType: { fontSize: 12, fontFamily: FONTS.medium },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, gap: 4 },
  statusBadgeText: { fontSize: 10, fontFamily: FONTS.semiBold, textTransform: 'uppercase' },

  // Progress Bar - Mobile
  progressContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
  progressBarBg: { flex: 1, height: 6, borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 11, fontFamily: FONTS.semiBold, minWidth: 50 },

  // Progress Bar - Tablet
  tabletProgressContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8, gap: 8 },
  tabletProgressBarBg: { flex: 1, height: 8, borderRadius: 4, overflow: 'hidden' },
  tabletProgressBarFill: { height: '100%', borderRadius: 4 },
  tabletProgressText: { fontSize: 12, fontFamily: FONTS.semiBold, minWidth: 40 },
  tabletFeeIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },

  feeAmountRow: { flexDirection: 'row', marginBottom: 10 },
  feeAmountItem: { flex: 1 },
  feeAmountLabel: { fontSize: 10, fontFamily: FONTS.medium, marginBottom: 2 },
  feeAmountValue: { fontSize: 14, fontFamily: FONTS.bold },
  feeCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  feeDueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tabletDueRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  feeDueText: { fontSize: 11, fontFamily: FONTS.medium },
  tabletDueText: { fontSize: 12, fontFamily: FONTS.medium },
  payButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, gap: 4 },
  tabletPayButton: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 6, marginTop: 8 },
  payButtonText: { fontSize: 12, fontFamily: FONTS.semiBold, color: '#fff' },
  tabletPayButtonText: { fontSize: 13, fontFamily: FONTS.semiBold, color: '#fff' },
  tabletFeeCardLeft: { flex: 1 },
  tabletFeeCardMiddle: { flex: 2, paddingHorizontal: 20 },
  tabletFeeCardRight: { alignItems: 'flex-end' },
  tabletAmountRow: { flexDirection: 'row', gap: 24 },
  tabletAmountItem: {},
  tabletAmountLabel: { fontSize: 11, fontFamily: FONTS.medium, marginBottom: 2 },
  tabletAmountValue: { fontSize: 15, fontFamily: FONTS.bold },

  // Empty State
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: 40, borderRadius: 12, borderWidth: 1 },
  emptyStateTitle: { fontSize: 16, fontFamily: FONTS.semiBold, marginTop: 12 },
  emptyStateSubtitle: { fontSize: 13, fontFamily: FONTS.medium, marginTop: 4 },

  // Quick Actions Section
  quickActionsSection: { paddingHorizontal: 16, marginBottom: 0 },
  tabletQuickActionsSection: { paddingHorizontal: 20, marginBottom: 0 },

  // Mobile Quick Actions Card
  quickActionsCard: { borderRadius: 12, borderWidth: 1, padding: 10, overflow: 'hidden' },
  quickActionsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  quickActionsIconWrap: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  quickActionsHeaderText: { flex: 1 },
  quickActionsTitle: { fontSize: 13, fontFamily: FONTS.bold },
  quickActionsSubtitle: { fontSize: 10, fontFamily: FONTS.medium, marginTop: 1 },
  mobileQuickActionsButtons: { flexDirection: 'row', gap: 6 },
  mobileQuickActionButton: { flex: 1, alignItems: 'center', paddingVertical: 8, paddingHorizontal: 4, borderRadius: 8 },
  mobileQuickActionIcon: { width: 32, height: 32, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  mobileQuickActionLabel: { fontSize: 9, fontFamily: FONTS.semiBold, textAlign: 'center', lineHeight: 12 },

  // Tablet Quick Actions - Modern Design
  tabletQuickActionsContainer: {},
  tabletQuickActionsHeader: { marginBottom: 6 },
  tabletQuickActionsTitle: { fontSize: 14, fontFamily: FONTS.bold },
  tabletQuickActionsSubtitle: { fontSize: 10, fontFamily: FONTS.medium, marginTop: 1 },
  tabletQuickActionsGrid: { flexDirection: 'row', gap: 8 },
  tabletQuickActionCardModern: { flex: 1, borderRadius: 8, borderWidth: 1, overflow: 'hidden' },
  tabletQuickActionAccent: { height: 2 },
  tabletQuickActionContent: { padding: 8, alignItems: 'center' },
  tabletQuickActionIconModern: { width: 34, height: 34, borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  tabletQuickActionTitleModern: { fontSize: 11, fontFamily: FONTS.semiBold, textAlign: 'center' },
  tabletQuickActionDescModern: { fontSize: 9, fontFamily: FONTS.medium, marginTop: 1, textAlign: 'center' },

});
