import { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { useTenantSettings } from '../contexts/TenantSettingsContext';
import { ProfileAvatar } from '../components/ui/ProfileAvatar';
import { ChildSwitcher, type ChildData } from '../components/ui/ChildSwitcher';

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

interface PaymentHistoryItem {
  id: string;
  feeName: string;
  amount: number;
  paidAmount: number;
  paymentDate: string;
  paymentMethod: 'card' | 'bank' | 'cash';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  transactionRef: string;
  term: string;
  year: string;
}

// Mock payment history data
const MOCK_PAYMENT_HISTORY: PaymentHistoryItem[] = [
  {
    id: 'pay-001',
    feeName: 'Tuition Fee - Term 1',
    amount: 150000,
    paidAmount: 150000,
    paymentDate: '2024-01-15',
    paymentMethod: 'card',
    status: 'completed',
    transactionRef: 'TXN-2024-001',
    term: 'Term 1',
    year: '2024',
  },
  {
    id: 'pay-002',
    feeName: 'Books & Materials',
    amount: 25000,
    paidAmount: 25000,
    paymentDate: '2024-01-20',
    paymentMethod: 'bank',
    status: 'completed',
    transactionRef: 'TXN-2024-002',
    term: 'Term 1',
    year: '2024',
  },
  {
    id: 'pay-003',
    feeName: 'Exam Fee',
    amount: 15000,
    paidAmount: 10000,
    paymentDate: '2024-02-01',
    paymentMethod: 'cash',
    status: 'completed',
    transactionRef: 'TXN-2024-003',
    term: 'Term 1',
    year: '2024',
  },
  {
    id: 'pay-004',
    feeName: 'Tuition Fee - Term 3',
    amount: 150000,
    paidAmount: 150000,
    paymentDate: '2023-09-10',
    paymentMethod: 'card',
    status: 'completed',
    transactionRef: 'TXN-2023-004',
    term: 'Term 3',
    year: '2023',
  },
  {
    id: 'pay-005',
    feeName: 'Sports Fee',
    amount: 10000,
    paidAmount: 10000,
    paymentDate: '2023-09-12',
    paymentMethod: 'bank',
    status: 'completed',
    transactionRef: 'TXN-2023-005',
    term: 'Term 3',
    year: '2023',
  },
  {
    id: 'pay-006',
    feeName: 'Tuition Fee - Term 2',
    amount: 150000,
    paidAmount: 150000,
    paymentDate: '2023-05-08',
    paymentMethod: 'card',
    status: 'completed',
    transactionRef: 'TXN-2023-006',
    term: 'Term 2',
    year: '2023',
  },
  {
    id: 'pay-007',
    feeName: 'Lab Fee',
    amount: 20000,
    paidAmount: 20000,
    paymentDate: '2023-05-15',
    paymentMethod: 'cash',
    status: 'completed',
    transactionRef: 'TXN-2023-007',
    term: 'Term 2',
    year: '2023',
  },
  {
    id: 'pay-008',
    feeName: 'Tuition Fee - Term 1',
    amount: 140000,
    paidAmount: 140000,
    paymentDate: '2023-01-12',
    paymentMethod: 'card',
    status: 'completed',
    transactionRef: 'TXN-2023-008',
    term: 'Term 1',
    year: '2023',
  },
];

// Filter options
const YEAR_OPTIONS = ['All Years', '2024', '2023', '2022'];
const STATUS_OPTIONS = ['All Status', 'Completed', 'Pending', 'Failed', 'Refunded'];
const METHOD_OPTIONS = ['All Methods', 'Card', 'Bank Transfer', 'Cash'];

// Mock children data - same as dashboard
const MOCK_CHILDREN: ChildData[] = [
  { id: 'child-001', name: 'Adaeze Okonkwo', classLevel: 'JSS 2', avatarUri: 'https://i.pravatar.cc/150?u=adaeze' },
  { id: 'child-002', name: 'Chukwuemeka Okonkwo', classLevel: 'SS 1', avatarUri: 'https://i.pravatar.cc/150?u=chukwuemeka' },
];

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

function getStatusConfig(status: PaymentHistoryItem['status'], colors: any) {
  switch (status) {
    case 'completed':
      return {
        label: 'Completed',
        bgColor: colors.successLight,
        textColor: colors.success,
        icon: 'checkmark-circle' as const,
      };
    case 'pending':
      return {
        label: 'Pending',
        bgColor: colors.warningLight,
        textColor: colors.warning,
        icon: 'time' as const,
      };
    case 'failed':
      return {
        label: 'Failed',
        bgColor: colors.errorLight,
        textColor: colors.error,
        icon: 'close-circle' as const,
      };
    case 'refunded':
      return {
        label: 'Refunded',
        bgColor: colors.infoLight,
        textColor: colors.info,
        icon: 'refresh' as const,
      };
    default:
      return {
        label: 'Unknown',
        bgColor: colors.backgroundTertiary,
        textColor: colors.textMuted,
        icon: 'help-circle' as const,
      };
  }
}

function getMethodConfig(method: PaymentHistoryItem['paymentMethod'], colors: any) {
  switch (method) {
    case 'card':
      return {
        label: 'Card',
        icon: 'card' as const,
        color: colors.primary,
      };
    case 'bank':
      return {
        label: 'Bank Transfer',
        icon: 'business' as const,
        color: colors.info,
      };
    case 'cash':
      return {
        label: 'Cash',
        icon: 'cash' as const,
        color: colors.success,
      };
    default:
      return {
        label: 'Unknown',
        icon: 'help-circle' as const,
        color: colors.textMuted,
      };
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
  });
}

export default function PaymentHistoryScreen() {
  const { colors, isDark } = useTheme();
  const { settings } = useTenantSettings();
  const { currencySymbol } = settings;
  const router = useRouter();
  const params = useLocalSearchParams();
  const isTablet = useIsTablet();

  // Get selected child from params or default to first child
  const initialChildId = (params.childId as string) || MOCK_CHILDREN[0]?.id || '';
  const [selectedChildId, setSelectedChildId] = useState(initialChildId);

  const selectedChild = MOCK_CHILDREN.find((c) => c.id === selectedChildId) || MOCK_CHILDREN[0];
  const childName = selectedChild?.name || 'Student';
  const childAvatar = selectedChild?.avatarUri || 'https://i.pravatar.cc/150?u=adaeze';
  const childClass = selectedChild?.classLevel || 'JSS 2';

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [yearFilter, setYearFilter] = useState('All Years');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [methodFilter, setMethodFilter] = useState('All Methods');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  // Handle child selection
  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    // Reset filters when switching child
    setYearFilter('All Years');
    setStatusFilter('All Status');
    setMethodFilter('All Methods');
    setSearchQuery('');
  };

  const formatCurrency = (amount: number) => {
    return `${currencySymbol}${amount.toLocaleString()}`;
  };

  // Toggle filters with animation
  const toggleFilters = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowFilters(!showFilters);
    setOpenDropdown(null);
  };

  // Reset filters
  const resetFilters = () => {
    setYearFilter('All Years');
    setStatusFilter('All Status');
    setMethodFilter('All Methods');
    setSearchQuery('');
  };

  // Check if any filter is active
  const hasActiveFilters =
    yearFilter !== 'All Years' ||
    statusFilter !== 'All Status' ||
    methodFilter !== 'All Methods' ||
    searchQuery.length > 0;

  // Filter payments
  const filteredPayments = MOCK_PAYMENT_HISTORY.filter((payment) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        payment.feeName.toLowerCase().includes(query) ||
        payment.transactionRef.toLowerCase().includes(query) ||
        payment.year.includes(query);
      if (!matchesSearch) return false;
    }

    // Year filter
    if (yearFilter !== 'All Years' && payment.year !== yearFilter) return false;

    // Status filter
    if (statusFilter !== 'All Status') {
      const statusMatch = payment.status === statusFilter.toLowerCase();
      if (!statusMatch) return false;
    }

    // Method filter
    if (methodFilter !== 'All Methods') {
      const methodMap: Record<string, string> = {
        'Card': 'card',
        'Bank Transfer': 'bank',
        'Cash': 'cash',
      };
      if (payment.paymentMethod !== methodMap[methodFilter]) return false;
    }

    return true;
  });

  // Group payments by year
  const paymentsByYear = filteredPayments.reduce((acc, payment) => {
    if (!acc[payment.year]) {
      acc[payment.year] = [];
    }
    acc[payment.year].push(payment);
    return acc;
  }, {} as Record<string, PaymentHistoryItem[]>);

  const years = Object.keys(paymentsByYear).sort((a, b) => Number(b) - Number(a));

  // Calculate summary stats
  const totalPaid = MOCK_PAYMENT_HISTORY.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalPayments = MOCK_PAYMENT_HISTORY.length;
  const completedPayments = MOCK_PAYMENT_HISTORY.filter((p) => p.status === 'completed').length;
  const cardPayments = MOCK_PAYMENT_HISTORY.filter((p) => p.paymentMethod === 'card').length;

  // Active filter count
  const activeFilterCount =
    (yearFilter !== 'All Years' ? 1 : 0) +
    (statusFilter !== 'All Status' ? 1 : 0) +
    (methodFilter !== 'All Methods' ? 1 : 0);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Fixed Header Bar - Back button only */}
      <View style={[styles.fixedHeader, { backgroundColor: colors.background }]}>
        <Pressable
          style={[styles.backButtonFixed, { backgroundColor: colors.backgroundTertiary }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.fixedHeaderTitle, { color: colors.text }]}>Payment History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Full Page ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentFull}
        showsVerticalScrollIndicator={false}
        onTouchStart={() => openDropdown && setOpenDropdown(null)}
      >
        {/* Header with Child Info */}
        {isTablet ? (
          /* TABLET: Modern layout with profile and child switcher */
          <View style={styles.tabletHeaderWrapper}>
            {/* Profile Row */}
            <View style={styles.tabletProfileRow}>
              {/* ProfileAvatar component */}
              <ProfileAvatar
                imageUri={childAvatar}
                name={childName}
                size="lg"
                gradient="green"
                enlargeOnPress
              />

              {/* Name and Class */}
              <View style={styles.tabletNameSection}>
                <Text style={[styles.tabletProfileName, { color: colors.text }]}>{childName}</Text>
                <View style={[styles.tabletClassBadge, { backgroundColor: colors.successLight }]}>
                  <Ionicons name="school" size={13} color={colors.success} />
                  <Text style={[styles.tabletClassText, { color: colors.success }]}>{childClass}</Text>
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
          </View>
        ) : (
          /* MOBILE: Modern design with child switcher */
          <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
            {/* Child Profile Section */}
            <View style={styles.profileSection}>
              {/* ProfileAvatar component */}
              <ProfileAvatar
                imageUri={childAvatar}
                name={childName}
                size="md"
                gradient="green"
                showOnlineIndicator
                enlargeOnPress
              />

              {/* Name and Class */}
              <View style={styles.profileDetails}>
                <Text style={[styles.profileName, { color: colors.text }]}>{childName}</Text>
                <View style={[styles.classBadge, { backgroundColor: colors.successLight }]}>
                  <Ionicons name="school" size={12} color={colors.success} />
                  <Text style={[styles.classBadgeText, { color: colors.success }]}>{childClass}</Text>
                </View>
              </View>

              {/* Child Switcher - Only show if multiple children */}
              {MOCK_CHILDREN.length > 1 && (
                <View style={styles.mobileChildSwitcherContainer}>
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
          </View>
        )}

        {/* Search and Filter Bar */}
        {isTablet ? (
          /* TABLET: Search and filter chips on one line */
          <View style={styles.tabletSearchFilterContainer}>
            {/* Search Input */}
            <View style={[styles.tabletSearchInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.searchIconWrap, { backgroundColor: colors.successLight }]}>
                <Ionicons name="search" size={14} color={colors.success} />
              </View>
              <TextInput
                style={{ flex: 1, fontSize: 14, fontFamily: FONTS.medium, color: colors.text, marginLeft: 10, paddingVertical: 0 }}
                placeholder="Search payments..."
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
              {/* Year Filter */}
              <View style={styles.tabletFilterChipWrapper} onTouchStart={(e) => e.stopPropagation()}>
                <Pressable
                  style={[
                    styles.tabletFilterChip,
                    {
                      backgroundColor: yearFilter !== 'All Years' ? colors.successLight : colors.surface,
                      borderColor: yearFilter !== 'All Years' ? colors.success : colors.border
                    }
                  ]}
                  onPress={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                >
                  <Ionicons name="calendar-outline" size={16} color={yearFilter !== 'All Years' ? colors.success : colors.textSecondary} />
                  <Text style={[styles.tabletFilterChipText, { color: yearFilter !== 'All Years' ? colors.success : colors.text }]}>
                    {yearFilter === 'All Years' ? 'Year' : yearFilter}
                  </Text>
                  <Ionicons name={openDropdown === 'year' ? 'chevron-up' : 'chevron-down'} size={14} color={yearFilter !== 'All Years' ? colors.success : colors.textMuted} />
                </Pressable>
                {openDropdown === 'year' && (
                  <View style={[styles.tabletDropdownMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {YEAR_OPTIONS.map((option, idx) => (
                      <Pressable
                        key={option}
                        style={[styles.tabletDropdownOption, yearFilter === option && { backgroundColor: colors.successLight }, idx === 0 && styles.tabletDropdownOptionFirst]}
                        onPress={() => { setYearFilter(option); setOpenDropdown(null); }}
                      >
                        <Text style={[styles.tabletDropdownOptionText, { color: yearFilter === option ? colors.success : colors.text }]}>{option}</Text>
                        {yearFilter === option && <Ionicons name="checkmark" size={18} color={colors.success} />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Status Filter */}
              <View style={styles.tabletFilterChipWrapper} onTouchStart={(e) => e.stopPropagation()}>
                <Pressable
                  style={[
                    styles.tabletFilterChip,
                    {
                      backgroundColor: statusFilter !== 'All Status' ? colors.successLight : colors.surface,
                      borderColor: statusFilter !== 'All Status' ? colors.success : colors.border
                    }
                  ]}
                  onPress={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                >
                  <Ionicons name="checkmark-circle-outline" size={16} color={statusFilter !== 'All Status' ? colors.success : colors.textSecondary} />
                  <Text style={[styles.tabletFilterChipText, { color: statusFilter !== 'All Status' ? colors.success : colors.text }]}>
                    {statusFilter === 'All Status' ? 'Status' : statusFilter}
                  </Text>
                  <Ionicons name={openDropdown === 'status' ? 'chevron-up' : 'chevron-down'} size={14} color={statusFilter !== 'All Status' ? colors.success : colors.textMuted} />
                </Pressable>
                {openDropdown === 'status' && (
                  <View style={[styles.tabletDropdownMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {STATUS_OPTIONS.map((option, idx) => (
                      <Pressable
                        key={option}
                        style={[styles.tabletDropdownOption, statusFilter === option && { backgroundColor: colors.successLight }, idx === 0 && styles.tabletDropdownOptionFirst]}
                        onPress={() => { setStatusFilter(option); setOpenDropdown(null); }}
                      >
                        <Text style={[styles.tabletDropdownOptionText, { color: statusFilter === option ? colors.success : colors.text }]}>{option}</Text>
                        {statusFilter === option && <Ionicons name="checkmark" size={18} color={colors.success} />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Method Filter */}
              <View style={styles.tabletFilterChipWrapper} onTouchStart={(e) => e.stopPropagation()}>
                <Pressable
                  style={[
                    styles.tabletFilterChip,
                    {
                      backgroundColor: methodFilter !== 'All Methods' ? colors.successLight : colors.surface,
                      borderColor: methodFilter !== 'All Methods' ? colors.success : colors.border
                    }
                  ]}
                  onPress={() => setOpenDropdown(openDropdown === 'method' ? null : 'method')}
                >
                  <Ionicons name="card-outline" size={16} color={methodFilter !== 'All Methods' ? colors.success : colors.textSecondary} />
                  <Text style={[styles.tabletFilterChipText, { color: methodFilter !== 'All Methods' ? colors.success : colors.text }]}>
                    {methodFilter === 'All Methods' ? 'Method' : methodFilter}
                  </Text>
                  <Ionicons name={openDropdown === 'method' ? 'chevron-up' : 'chevron-down'} size={14} color={methodFilter !== 'All Methods' ? colors.success : colors.textMuted} />
                </Pressable>
                {openDropdown === 'method' && (
                  <View style={[styles.tabletDropdownMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {METHOD_OPTIONS.map((option, idx) => (
                      <Pressable
                        key={option}
                        style={[styles.tabletDropdownOption, methodFilter === option && { backgroundColor: colors.successLight }, idx === 0 && styles.tabletDropdownOptionFirst]}
                        onPress={() => { setMethodFilter(option); setOpenDropdown(null); }}
                      >
                        <Text style={[styles.tabletDropdownOptionText, { color: methodFilter === option ? colors.success : colors.text }]}>{option}</Text>
                        {methodFilter === option && <Ionicons name="checkmark" size={18} color={colors.success} />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Reset Button */}
              {hasActiveFilters && (
                <Pressable
                  style={[styles.resetChip, { backgroundColor: colors.errorLight }]}
                  onPress={resetFilters}
                >
                  <Ionicons name="refresh" size={14} color={colors.error} />
                  <Text style={[styles.resetChipText, { color: colors.error }]}>Reset</Text>
                </Pressable>
              )}
            </View>
          </View>
        ) : (
          /* MOBILE: Search and filter toggle */
          <View style={styles.searchFilterContainer}>
            <View style={[styles.searchInputContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.searchIconWrap, { backgroundColor: colors.successLight }]}>
                <Ionicons name="search" size={14} color={colors.success} />
              </View>
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search payments..."
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
                  backgroundColor: showFilters ? colors.successLight : colors.surface,
                  borderColor: showFilters ? colors.success : colors.border
                }
              ]}
              onPress={toggleFilters}
            >
              <Ionicons name="options" size={20} color={showFilters ? colors.success : colors.textSecondary} />
              {activeFilterCount > 0 && (
                <View style={styles.filterCountBadge}>
                  <Text style={styles.filterCountText}>{activeFilterCount}</Text>
                </View>
              )}
            </Pressable>
          </View>
        )}

        {/* Mobile Filter Panel */}
        {!isTablet && showFilters && (
          <View style={[styles.filterPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.filterPanelHeader}>
              <Text style={[styles.filterPanelTitle, { color: colors.text }]}>Filters</Text>
              {hasActiveFilters && (
                <Pressable style={[styles.resetButton, { backgroundColor: colors.errorLight }]} onPress={resetFilters}>
                  <Ionicons name="refresh" size={14} color={colors.error} />
                  <Text style={[styles.resetButtonText, { color: colors.error }]}>Reset</Text>
                </Pressable>
              )}
            </View>

            <View style={styles.filterGrid}>
              {/* Year Filter */}
              <View style={{ marginBottom: 8 }} onTouchStart={(e) => e.stopPropagation()}>
                <Pressable
                  onPress={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: openDropdown === 'year' ? colors.successLight : colors.backgroundTertiary,
                    borderWidth: 1.5,
                    borderColor: openDropdown === 'year' ? colors.success : (yearFilter !== 'All Years' ? colors.success + '40' : 'transparent'),
                    borderRadius: 12,
                    paddingLeft: 14,
                    paddingRight: 10,
                    paddingVertical: 10,
                    minHeight: 56,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, fontFamily: FONTS.semiBold, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.textMuted, marginBottom: 2 }}>Year</Text>
                    <Text style={{ fontSize: 14, fontFamily: FONTS.semiBold, color: yearFilter !== 'All Years' ? colors.success : colors.text }} numberOfLines={1}>{yearFilter}</Text>
                  </View>
                  <View style={{ width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: openDropdown === 'year' ? colors.success : colors.border + '60' }}>
                    <Ionicons name={openDropdown === 'year' ? 'chevron-up' : 'chevron-down'} size={14} color={openDropdown === 'year' ? '#ffffff' : colors.textMuted} />
                  </View>
                </Pressable>
                {openDropdown === 'year' && (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
                    {YEAR_OPTIONS.map((option, index) => (
                      <Pressable
                        key={option}
                        onPress={() => { setYearFilter(option); setOpenDropdown(null); }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          backgroundColor: yearFilter === option ? colors.successLight : 'transparent',
                          borderTopWidth: index > 0 ? 1 : 0,
                          borderTopColor: colors.border,
                        }}
                      >
                        <Text style={{ fontSize: 14, fontFamily: yearFilter === option ? FONTS.semiBold : FONTS.medium, color: yearFilter === option ? colors.success : colors.text }}>{option}</Text>
                        {yearFilter === option && (
                          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="checkmark" size={12} color="#ffffff" />
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Status Filter */}
              <View style={{ marginBottom: 8 }} onTouchStart={(e) => e.stopPropagation()}>
                <Pressable
                  onPress={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: openDropdown === 'status' ? colors.successLight : colors.backgroundTertiary,
                    borderWidth: 1.5,
                    borderColor: openDropdown === 'status' ? colors.success : (statusFilter !== 'All Status' ? colors.success + '40' : 'transparent'),
                    borderRadius: 12,
                    paddingLeft: 14,
                    paddingRight: 10,
                    paddingVertical: 10,
                    minHeight: 56,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, fontFamily: FONTS.semiBold, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.textMuted, marginBottom: 2 }}>Status</Text>
                    <Text style={{ fontSize: 14, fontFamily: FONTS.semiBold, color: statusFilter !== 'All Status' ? colors.success : colors.text }} numberOfLines={1}>{statusFilter}</Text>
                  </View>
                  <View style={{ width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: openDropdown === 'status' ? colors.success : colors.border + '60' }}>
                    <Ionicons name={openDropdown === 'status' ? 'chevron-up' : 'chevron-down'} size={14} color={openDropdown === 'status' ? '#ffffff' : colors.textMuted} />
                  </View>
                </Pressable>
                {openDropdown === 'status' && (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
                    {STATUS_OPTIONS.map((option, index) => (
                      <Pressable
                        key={option}
                        onPress={() => { setStatusFilter(option); setOpenDropdown(null); }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          backgroundColor: statusFilter === option ? colors.successLight : 'transparent',
                          borderTopWidth: index > 0 ? 1 : 0,
                          borderTopColor: colors.border,
                        }}
                      >
                        <Text style={{ fontSize: 14, fontFamily: statusFilter === option ? FONTS.semiBold : FONTS.medium, color: statusFilter === option ? colors.success : colors.text }}>{option}</Text>
                        {statusFilter === option && (
                          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="checkmark" size={12} color="#ffffff" />
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Method Filter */}
              <View style={{ marginBottom: 8 }} onTouchStart={(e) => e.stopPropagation()}>
                <Pressable
                  onPress={() => setOpenDropdown(openDropdown === 'method' ? null : 'method')}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: openDropdown === 'method' ? colors.successLight : colors.backgroundTertiary,
                    borderWidth: 1.5,
                    borderColor: openDropdown === 'method' ? colors.success : (methodFilter !== 'All Methods' ? colors.success + '40' : 'transparent'),
                    borderRadius: 12,
                    paddingLeft: 14,
                    paddingRight: 10,
                    paddingVertical: 10,
                    minHeight: 56,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 10, fontFamily: FONTS.semiBold, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.textMuted, marginBottom: 2 }}>Payment Method</Text>
                    <Text style={{ fontSize: 14, fontFamily: FONTS.semiBold, color: methodFilter !== 'All Methods' ? colors.success : colors.text }} numberOfLines={1}>{methodFilter}</Text>
                  </View>
                  <View style={{ width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: openDropdown === 'method' ? colors.success : colors.border + '60' }}>
                    <Ionicons name={openDropdown === 'method' ? 'chevron-up' : 'chevron-down'} size={14} color={openDropdown === 'method' ? '#ffffff' : colors.textMuted} />
                  </View>
                </Pressable>
                {openDropdown === 'method' && (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
                    {METHOD_OPTIONS.map((option, index) => (
                      <Pressable
                        key={option}
                        onPress={() => { setMethodFilter(option); setOpenDropdown(null); }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          paddingHorizontal: 16,
                          paddingVertical: 14,
                          backgroundColor: methodFilter === option ? colors.successLight : 'transparent',
                          borderTopWidth: index > 0 ? 1 : 0,
                          borderTopColor: colors.border,
                        }}
                      >
                        <Text style={{ fontSize: 14, fontFamily: methodFilter === option ? FONTS.semiBold : FONTS.medium, color: methodFilter === option ? colors.success : colors.text }}>{option}</Text>
                        {methodFilter === option && (
                          <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.success, alignItems: 'center', justifyContent: 'center' }}>
                            <Ionicons name="checkmark" size={12} color="#ffffff" />
                          </View>
                        )}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>
          </View>
        )}

        {/* Collapsible Payment Summary */}
        {(() => {
          return (
            <View style={[
              styles.performanceSummaryContainer,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                marginHorizontal: isTablet ? 24 : 16,
              }
            ]}>
              <Pressable
                style={styles.performanceSummaryHeader}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setSummaryExpanded(!summaryExpanded);
                }}
              >
                <View style={styles.performanceSummaryHeaderLeft}>
                  <View style={[styles.performanceSummaryIcon, { backgroundColor: colors.successLight }]}>
                    <Ionicons name="wallet" size={20} color={colors.success} />
                  </View>
                  <View>
                    <Text style={[styles.performanceSummaryTitle, { color: colors.text }]}>Payment Summary</Text>
                    <Text style={[styles.performanceSummarySubtitle, { color: colors.textMuted }]}>
                      Total Paid: {formatCurrency(totalPaid)}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={[styles.summaryBadge, { backgroundColor: colors.successLight }]}>
                    <Text style={[styles.summaryBadgeText, { color: colors.success }]}>{totalPayments} payments</Text>
                  </View>
                  <Ionicons
                    name={summaryExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color={colors.textMuted}
                  />
                </View>
              </Pressable>

              {/* Expandable Content */}
              {summaryExpanded && (
                <>
                  {/* Stats Cards - Tablet */}
                  {isTablet && (
                    <View style={[styles.tabletStatsCardsRow, { paddingHorizontal: 16, paddingBottom: 16 }]}>
                      {/* Total Paid Card */}
                      <View style={[styles.tabletStatCard, { backgroundColor: isDark ? colors.surface : '#ecfdf5', borderColor: isDark ? colors.border : '#a7f3d0' }]}>
                        <View style={styles.tabletStatCardTop}>
                          <Text style={[styles.tabletStatCardLabel, { color: isDark ? colors.success : '#059669' }]}>Total Paid</Text>
                          <View style={[styles.tabletStatCardIcon, { backgroundColor: isDark ? colors.successLight : '#a7f3d0' }]}>
                            <Ionicons name="wallet" size={16} color={isDark ? colors.success : '#059669'} />
                          </View>
                        </View>
                        <Text style={[styles.tabletStatCardValue, { color: isDark ? colors.text : '#064e3b' }]}>{formatCurrency(totalPaid)}</Text>
                      </View>

                      {/* Total Payments Card */}
                      <View style={[styles.tabletStatCard, { backgroundColor: isDark ? colors.surface : '#eff6ff', borderColor: isDark ? colors.border : '#bfdbfe' }]}>
                        <View style={styles.tabletStatCardTop}>
                          <Text style={[styles.tabletStatCardLabel, { color: isDark ? colors.info : '#2563eb' }]}>Payments</Text>
                          <View style={[styles.tabletStatCardIcon, { backgroundColor: isDark ? colors.infoLight : '#bfdbfe' }]}>
                            <Ionicons name="receipt" size={16} color={isDark ? colors.info : '#2563eb'} />
                          </View>
                        </View>
                        <Text style={[styles.tabletStatCardValue, { color: isDark ? colors.text : '#1e3a8a' }]}>{totalPayments}</Text>
                      </View>

                      {/* Completed Card */}
                      <View style={[styles.tabletStatCard, { backgroundColor: isDark ? colors.surface : '#fef3c7', borderColor: isDark ? colors.border : '#fcd34d' }]}>
                        <View style={styles.tabletStatCardTop}>
                          <Text style={[styles.tabletStatCardLabel, { color: isDark ? colors.warning : '#d97706' }]}>Completed</Text>
                          <View style={[styles.tabletStatCardIcon, { backgroundColor: isDark ? colors.warningLight : '#fcd34d' }]}>
                            <Ionicons name="checkmark-circle" size={16} color={isDark ? colors.warning : '#d97706'} />
                          </View>
                        </View>
                        <Text style={[styles.tabletStatCardValue, { color: isDark ? colors.text : '#78350f' }]}>{completedPayments}</Text>
                      </View>

                      {/* Card Payments Card */}
                      <View style={[styles.tabletStatCard, { backgroundColor: isDark ? colors.surface : '#fce7f3', borderColor: isDark ? colors.border : '#f9a8d4' }]}>
                        <View style={styles.tabletStatCardTop}>
                          <Text style={[styles.tabletStatCardLabel, { color: isDark ? colors.accent : '#db2777' }]}>Card Payments</Text>
                          <View style={[styles.tabletStatCardIcon, { backgroundColor: isDark ? colors.accentLight : '#f9a8d4' }]}>
                            <Ionicons name="card" size={16} color={isDark ? colors.accent : '#db2777'} />
                          </View>
                        </View>
                        <Text style={[styles.tabletStatCardValue, { color: isDark ? colors.text : '#831843' }]}>{cardPayments}</Text>
                      </View>
                    </View>
                  )}

                  {/* Stats Cards - Mobile */}
                  {!isTablet && (
                    <View style={[styles.mobileYearStatsRow, { paddingHorizontal: 16, paddingBottom: 16 }]}>
                      {/* Total Paid Card */}
                      <View style={[styles.mobileYearStatCard, { backgroundColor: isDark ? colors.surface : '#ecfdf5', borderColor: isDark ? colors.border : '#a7f3d0' }]}>
                        <View style={styles.mobileYearStatCardTop}>
                          <Text style={[styles.mobileYearStatCardLabel, { color: isDark ? colors.success : '#059669' }]}>Total Paid</Text>
                          <View style={[styles.mobileYearStatCardIcon, { backgroundColor: isDark ? colors.successLight : '#a7f3d0' }]}>
                            <Ionicons name="wallet" size={12} color={isDark ? colors.success : '#059669'} />
                          </View>
                        </View>
                        <Text style={[styles.mobileYearStatCardValue, { color: isDark ? colors.text : '#064e3b' }]}>{formatCurrency(totalPaid)}</Text>
                      </View>

                      {/* Total Payments Card */}
                      <View style={[styles.mobileYearStatCard, { backgroundColor: isDark ? colors.surface : '#eff6ff', borderColor: isDark ? colors.border : '#bfdbfe' }]}>
                        <View style={styles.mobileYearStatCardTop}>
                          <Text style={[styles.mobileYearStatCardLabel, { color: isDark ? colors.info : '#2563eb' }]}>Payments</Text>
                          <View style={[styles.mobileYearStatCardIcon, { backgroundColor: isDark ? colors.infoLight : '#bfdbfe' }]}>
                            <Ionicons name="receipt" size={12} color={isDark ? colors.info : '#2563eb'} />
                          </View>
                        </View>
                        <Text style={[styles.mobileYearStatCardValue, { color: isDark ? colors.text : '#1e3a8a' }]}>{totalPayments}</Text>
                      </View>

                      {/* Completed Card */}
                      <View style={[styles.mobileYearStatCard, { backgroundColor: isDark ? colors.surface : '#fef3c7', borderColor: isDark ? colors.border : '#fcd34d' }]}>
                        <View style={styles.mobileYearStatCardTop}>
                          <Text style={[styles.mobileYearStatCardLabel, { color: isDark ? colors.warning : '#d97706' }]}>Completed</Text>
                          <View style={[styles.mobileYearStatCardIcon, { backgroundColor: isDark ? colors.warningLight : '#fcd34d' }]}>
                            <Ionicons name="checkmark-circle" size={12} color={isDark ? colors.warning : '#d97706'} />
                          </View>
                        </View>
                        <Text style={[styles.mobileYearStatCardValue, { color: isDark ? colors.text : '#78350f' }]}>{completedPayments}</Text>
                      </View>

                      {/* Card Payments Card */}
                      <View style={[styles.mobileYearStatCard, { backgroundColor: isDark ? colors.surface : '#fce7f3', borderColor: isDark ? colors.border : '#f9a8d4' }]}>
                        <View style={styles.mobileYearStatCardTop}>
                          <Text style={[styles.mobileYearStatCardLabel, { color: isDark ? colors.accent : '#db2777' }]}>Card Payments</Text>
                          <View style={[styles.mobileYearStatCardIcon, { backgroundColor: isDark ? colors.accentLight : '#f9a8d4' }]}>
                            <Ionicons name="card" size={12} color={isDark ? colors.accent : '#db2777'} />
                          </View>
                        </View>
                        <Text style={[styles.mobileYearStatCardValue, { color: isDark ? colors.text : '#831843' }]}>{cardPayments}</Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })()}

        {/* Results Count */}
        <View style={styles.resultsCount}>
          <Text style={[styles.resultsCountText, { color: colors.textMuted }]}>
            {filteredPayments.length} of {MOCK_PAYMENT_HISTORY.length} payments
          </Text>
        </View>

        {/* Payment History List */}
        <View style={[styles.paymentsListContainer, isTablet && styles.paymentsListContainerTablet]}>
          {years.length === 0 ? (
            <View style={[styles.emptyState, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.emptyStateIcon, { backgroundColor: colors.backgroundTertiary }]}>
                <Ionicons name="receipt-outline" size={32} color={colors.textMuted} />
              </View>
              <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Payments Found</Text>
              <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
                No payment records match your search criteria.
              </Text>
              {hasActiveFilters && (
                <Pressable style={[styles.emptyStateButton, { backgroundColor: colors.success }]} onPress={resetFilters}>
                  <Text style={styles.emptyStateButtonText}>Clear Filters</Text>
                </Pressable>
              )}
            </View>
          ) : (
            years.map((year) => (
              <View key={year} style={styles.yearSection}>
                {/* Year Header */}
                <View style={styles.yearHeader}>
                  <View style={[styles.yearBadge, { backgroundColor: colors.successLight }]}>
                    <Ionicons name="calendar" size={14} color={colors.success} />
                    <Text style={[styles.yearText, { color: colors.success }]}>{year}</Text>
                  </View>
                  <View style={[styles.yearLine, { backgroundColor: colors.border }]} />
                  <Text style={[styles.yearCount, { color: colors.textMuted }]}>
                    {paymentsByYear[year].length} payments
                  </Text>
                </View>

                {/* Payments Grid */}
                <View style={[styles.paymentsGrid, isTablet && styles.paymentsGridTablet]}>
                  {paymentsByYear[year].map((payment) => {
                    const statusConfig = getStatusConfig(payment.status, colors);
                    const methodConfig = getMethodConfig(payment.paymentMethod, colors);

                    return (
                      <View
                        key={payment.id}
                        style={[
                          styles.paymentCard,
                          { backgroundColor: colors.surface, borderColor: colors.border },
                          isTablet && styles.paymentCardTablet
                        ]}
                      >
                        {/* Card Header */}
                        <View style={styles.paymentCardHeader}>
                          <View style={styles.paymentCardHeaderLeft}>
                            <View style={[styles.termBadge, { backgroundColor: colors.backgroundTertiary }]}>
                              <Text style={[styles.termBadgeText, { color: colors.textSecondary }]}>{payment.term}</Text>
                            </View>
                            <Text style={[styles.paymentFeeName, { color: colors.text }]} numberOfLines={1}>
                              {payment.feeName}
                            </Text>
                          </View>
                          <View style={[styles.amountCircle, { backgroundColor: colors.successLight }]}>
                            <Text style={[styles.amountCircleText, { color: colors.success }]}>
                              {currencySymbol}{(payment.paidAmount / 1000).toFixed(0)}k
                            </Text>
                          </View>
                        </View>

                        {/* Payment Details */}
                        <View style={[styles.paymentStatsGrid, { backgroundColor: colors.backgroundSecondary }]}>
                          {/* Amount Card */}
                          <View style={[styles.paymentStatCard, { backgroundColor: isDark ? colors.surface : '#f0fdf4' }]}>
                            <View style={styles.paymentStatCardTop}>
                              <Text style={[styles.paymentStatCardLabel, { color: isDark ? colors.success : '#16a34a' }]}>Amount</Text>
                              <View style={[styles.paymentStatCardIcon, { backgroundColor: isDark ? colors.successLight : '#dcfce7' }]}>
                                <Ionicons name="cash" size={10} color={isDark ? colors.success : '#16a34a'} />
                              </View>
                            </View>
                            <Text style={[styles.paymentStatCardValue, { color: isDark ? colors.text : '#14532d' }]}>
                              {formatCurrency(payment.paidAmount)}
                            </Text>
                          </View>

                          {/* Method Card */}
                          <View style={[styles.paymentStatCard, { backgroundColor: isDark ? colors.surface : '#eff6ff' }]}>
                            <View style={styles.paymentStatCardTop}>
                              <Text style={[styles.paymentStatCardLabel, { color: isDark ? colors.info : '#2563eb' }]}>Method</Text>
                              <View style={[styles.paymentStatCardIcon, { backgroundColor: isDark ? colors.infoLight : '#dbeafe' }]}>
                                <Ionicons name={methodConfig.icon} size={10} color={isDark ? colors.info : '#2563eb'} />
                              </View>
                            </View>
                            <Text style={[styles.paymentStatCardValue, { color: isDark ? colors.text : '#1e3a8a' }]}>
                              {methodConfig.label}
                            </Text>
                          </View>

                          {/* Date Card */}
                          <View style={[styles.paymentStatCard, { backgroundColor: isDark ? colors.surface : '#fefce8' }]}>
                            <View style={styles.paymentStatCardTop}>
                              <Text style={[styles.paymentStatCardLabel, { color: isDark ? colors.warning : '#ca8a04' }]}>Date</Text>
                              <View style={[styles.paymentStatCardIcon, { backgroundColor: isDark ? colors.warningLight : '#fef9c3' }]}>
                                <Ionicons name="calendar" size={10} color={isDark ? colors.warning : '#ca8a04'} />
                              </View>
                            </View>
                            <Text style={[styles.paymentStatCardValue, { color: isDark ? colors.text : '#713f12' }]}>
                              {formatShortDate(payment.paymentDate)}
                            </Text>
                          </View>

                          {/* Status Card */}
                          <View style={[styles.paymentStatCard, { backgroundColor: isDark ? colors.surface : statusConfig.bgColor }]}>
                            <View style={styles.paymentStatCardTop}>
                              <Text style={[styles.paymentStatCardLabel, { color: statusConfig.textColor }]}>Status</Text>
                              <View style={[styles.paymentStatCardIcon, { backgroundColor: statusConfig.bgColor }]}>
                                <Ionicons name={statusConfig.icon} size={10} color={statusConfig.textColor} />
                              </View>
                            </View>
                            <Text style={[styles.paymentStatCardValue, { color: statusConfig.textColor }]}>
                              {statusConfig.label}
                            </Text>
                          </View>
                        </View>

                        {/* Transaction Reference */}
                        <View style={[styles.paymentInfoRow, { borderTopColor: colors.border }]}>
                          <View style={styles.paymentInfoLeft}>
                            <Ionicons name="document-text-outline" size={14} color={colors.textMuted} />
                            <Text style={[styles.paymentRefText, { color: colors.textMuted }]}>
                              Ref: {payment.transactionRef}
                            </Text>
                          </View>
                          <Pressable style={[styles.viewReceiptButton, { backgroundColor: colors.successLight }]}>
                            <Text style={[styles.viewReceiptText, { color: colors.success }]}>View Receipt</Text>
                            <Ionicons name="chevron-forward" size={14} color={colors.success} />
                          </Pressable>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  fixedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButtonFixed: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fixedHeaderTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContentFull: {
    paddingBottom: 20,
  },
  // Tablet Header
  tabletHeaderWrapper: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  tabletProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  tabletAvatarPressable: {},
  tabletAvatarWrapper: {
    transform: [{ scale: 1 }],
  },
  tabletAvatarEnlarged: {
    transform: [{ scale: 1.1 }],
  },
  tabletAvatarGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
  },
  tabletAvatarInner: {
    flex: 1,
    borderRadius: 33,
    padding: 2,
  },
  tabletAvatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 31,
  },
  tabletNameSection: {
    flex: 1,
    gap: 8,
  },
  // Child Switcher Containers
  childSwitcherContainer: {
    marginLeft: 'auto',
    maxWidth: 200,
    zIndex: 100,
  },
  mobileChildSwitcherContainer: {
    marginLeft: 'auto',
    maxWidth: 160,
    zIndex: 100,
  },
  tabletProfileName: {
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  tabletClassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 6,
  },
  tabletClassText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  // Mobile Header
  headerContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mobileAvatarPressable: {},
  avatarContainer: {
    position: 'relative',
  },
  mobileAvatarEnlarged: {
    transform: [{ scale: 1.1 }],
  },
  avatarRing: {
    width: 68,
    height: 68,
    borderRadius: 34,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 31,
    padding: 2,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 29,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#22c55e',
    borderWidth: 3,
  },
  profileDetails: {
    marginLeft: 14,
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 6,
  },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 5,
  },
  classBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  // Tablet Search & Filter
  tabletSearchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 16,
  },
  tabletSearchInput: {
    flex: 1,
    maxWidth: 320,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
  },
  tabletFilterChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tabletFilterChipWrapper: {
    position: 'relative',
    zIndex: 100,
  },
  tabletFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 6,
  },
  tabletFilterChipText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  tabletDropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    minWidth: 160,
    marginTop: 6,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    zIndex: 1000,
    overflow: 'hidden',
  },
  tabletDropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  tabletDropdownOptionFirst: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  tabletDropdownOptionText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  resetChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  resetChipText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  // Mobile Search & Filter
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  searchIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.medium,
    paddingVertical: 0,
  },
  searchClearButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterToggleButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  filterCountBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  filterCountText: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#ffffff',
  },
  // Filter Panel
  filterPanel: {
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  filterPanelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterPanelTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  resetButtonText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  filterGrid: {
    gap: 0,
  },
  // Summary Section
  performanceSummaryContainer: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  performanceSummaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  performanceSummaryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  performanceSummaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  performanceSummaryTitle: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  performanceSummarySubtitle: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  summaryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  summaryBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  // Tablet Stats
  tabletStatsCardsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  tabletStatCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  tabletStatCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tabletStatCardLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  tabletStatCardIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletStatCardValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  // Mobile Stats
  mobileYearStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mobileYearStatCard: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  mobileYearStatCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  mobileYearStatCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  mobileYearStatCardIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileYearStatCardValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  // Results Count
  resultsCount: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsCountText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  // Payments List
  paymentsListContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  paymentsListContainerTablet: {
    paddingHorizontal: 24,
  },
  // Year Section
  yearSection: {
    marginBottom: 24,
  },
  yearHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  yearBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 6,
  },
  yearText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  yearLine: {
    flex: 1,
    height: 1,
    marginHorizontal: 12,
  },
  yearCount: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  // Payments Grid
  paymentsGrid: {
    gap: 12,
  },
  paymentsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  // Payment Card
  paymentCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  paymentCardTablet: {
    width: (SCREEN_WIDTH - 48 - 16) / 2,
  },
  paymentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
  },
  paymentCardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  termBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  termBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  paymentFeeName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  amountCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  amountCircleText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  // Payment Stats Grid
  paymentStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },
  paymentStatCard: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  paymentStatCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  paymentStatCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  paymentStatCardIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentStatCardValue: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  // Payment Info Row
  paymentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
  },
  paymentInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paymentRefText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  viewReceiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  viewReceiptText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    padding: 32,
    borderRadius: 16,
    borderWidth: 1,
  },
  emptyStateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyStateButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyStateButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
});
