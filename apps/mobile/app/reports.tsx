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
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';
import { ProfileAvatar } from '../components/ui/ProfileAvatar';
import { ChildSwitcher, type ChildData } from '../components/ui/ChildSwitcher';
import type { ThemeColors } from "@/contexts/ThemeContext";

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

interface ReportHistoryItem {
  id: string;
  examType: string;
  term: string;
  year: string;
  totalPercentage: number;
  rank: number;
  totalStudents: number;
  status: 'pass' | 'fail';
  datePublished: string;
  subjects: number;
  attendance: number;
  conduct: string;
}

// Mock report history data (matching screenshot data)
const MOCK_REPORT_HISTORY: ReportHistoryItem[] = [
  {
    id: 'report-001',
    examType: 'Third Term Exam',
    term: 'Term 3',
    year: '2024',
    totalPercentage: 72,
    rank: 9,
    totalStudents: 42,
    status: 'pass',
    datePublished: '2024-12-10',
    subjects: 7,
    attendance: 94,
    conduct: 'A',
  },
  {
    id: 'report-002',
    examType: 'Second Term Exam',
    term: 'Term 2',
    year: '2024',
    totalPercentage: 68,
    rank: 12,
    totalStudents: 42,
    status: 'pass',
    datePublished: '2024-08-15',
    subjects: 7,
    attendance: 91,
    conduct: 'B+',
  },
  {
    id: 'report-003',
    examType: 'First Term Exam',
    term: 'Term 1',
    year: '2024',
    totalPercentage: 45,
    rank: 20,
    totalStudents: 42,
    status: 'fail',
    datePublished: '2024-04-12',
    subjects: 7,
    attendance: 78,
    conduct: 'B',
  },
  {
    id: 'report-004',
    examType: 'Third Term Exam',
    term: 'Term 3',
    year: '2023',
    totalPercentage: 78,
    rank: 5,
    totalStudents: 45,
    status: 'pass',
    datePublished: '2023-12-15',
    subjects: 8,
    attendance: 96,
    conduct: 'A+',
  },
  {
    id: 'report-005',
    examType: 'Second Term Exam',
    term: 'Term 2',
    year: '2023',
    totalPercentage: 82,
    rank: 3,
    totalStudents: 45,
    status: 'pass',
    datePublished: '2023-08-20',
    subjects: 8,
    attendance: 98,
    conduct: 'A',
  },
  {
    id: 'report-006',
    examType: 'First Term Exam',
    term: 'Term 1',
    year: '2023',
    totalPercentage: 65,
    rank: 15,
    totalStudents: 45,
    status: 'pass',
    datePublished: '2023-04-15',
    subjects: 8,
    attendance: 89,
    conduct: 'B+',
  },
];

// Filter options
const YEAR_OPTIONS = ['All Years', '2025', '2024', '2023', '2022'];
const TERM_OPTIONS = ['All Terms', 'Term 1', 'Term 2', 'Term 3'];
const STATUS_OPTIONS = ['All Status', 'Passed', 'Failed'];

// Mock children data - same as dashboard
const MOCK_CHILDREN: ChildData[] = [
  { id: 'child-001', name: 'Adaeze Okonkwo', classLevel: 'JSS 2', avatarUri: 'https://i.pravatar.cc/150?u=adaeze' },
  { id: 'child-002', name: 'Chukwuemeka Okonkwo', classLevel: 'SS 1', avatarUri: 'https://i.pravatar.cc/150?u=chukwuemeka' },
];

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

function getScoreGradient(percentage: number): readonly [string, string] {
  if (percentage >= 70) return ['#10b981', '#059669'] as const;
  if (percentage >= 50) return ['#f59e0b', '#d97706'] as const;
  return ['#ef4444', '#dc2626'] as const;
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
  });
}

// Modern Filter Dropdown Component - Inline expansion style
function FilterDropdown({
  label,
  value,
  options,
  onSelect,
  isOpen,
  onToggle,
  colors,
}: {
  label: string;
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  colors: ThemeColors;
}) {
  const isSelected = value !== options[0];

  return (
    <View style={{ marginBottom: 8 }} onTouchStart={(e) => e.stopPropagation()}>
      {/* Dropdown Button */}
      <Pressable
        onPress={onToggle}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: isOpen ? colors.primaryLight : colors.backgroundTertiary,
          borderWidth: 1.5,
          borderColor: isOpen ? colors.primary : (isSelected ? colors.primary + '40' : 'transparent'),
          borderRadius: 12,
          paddingLeft: 14,
          paddingRight: 10,
          paddingVertical: 10,
          minHeight: 56,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontFamily: FONTS.semiBold, textTransform: 'uppercase', letterSpacing: 0.5, color: colors.textMuted, marginBottom: 2 }}>{label}</Text>
          <Text style={{ fontSize: 14, fontFamily: FONTS.semiBold, color: isSelected ? colors.primary : colors.text }} numberOfLines={1}>{value}</Text>
        </View>
        <View style={{ width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: isOpen ? colors.primary : colors.border + '60' }}>
          <Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} color={isOpen ? '#ffffff' : colors.textMuted} />
        </View>
      </Pressable>

      {/* Dropdown Options - Inline below the button */}
      {isOpen && (
        <View style={{ backgroundColor: colors.surface, borderRadius: 12, marginTop: 8, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
          {options.map((option, index) => {
            const isOptionSelected = value === option;
            return (
              <Pressable
                key={option}
                onPress={() => {
                  onSelect(option);
                  onToggle();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  backgroundColor: isOptionSelected ? colors.primaryLight : 'transparent',
                  borderTopWidth: index > 0 ? 1 : 0,
                  borderTopColor: colors.border,
                }}
              >
                <Text style={{ fontSize: 14, fontFamily: isOptionSelected ? FONTS.semiBold : FONTS.medium, color: isOptionSelected ? colors.primary : colors.text }}>{option}</Text>
                {isOptionSelected && (
                  <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="checkmark" size={12} color="#ffffff" />
                  </View>
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

export default function ReportsHistoryScreen() {
  const { colors, isDark } = useTheme();
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
  const [termFilter, setTermFilter] = useState('All Terms');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [summaryExpanded, setSummaryExpanded] = useState(false);

  // Handle child selection
  const handleSelectChild = (childId: string) => {
    setSelectedChildId(childId);
    // Reset filters when switching child
    setYearFilter('All Years');
    setTermFilter('All Terms');
    setStatusFilter('All Status');
    setSearchQuery('');
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
    setTermFilter('All Terms');
    setStatusFilter('All Status');
    setSearchQuery('');
  };

  // Check if any filter is active
  const hasActiveFilters =
    yearFilter !== 'All Years' ||
    termFilter !== 'All Terms' ||
    statusFilter !== 'All Status' ||
    searchQuery.length > 0;

  // Filter reports
  const filteredReports = MOCK_REPORT_HISTORY.filter((report) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesSearch =
        report.examType.toLowerCase().includes(query) ||
        report.term.toLowerCase().includes(query) ||
        report.year.includes(query);
      if (!matchesSearch) return false;
    }

    // Year filter
    if (yearFilter !== 'All Years' && report.year !== yearFilter) return false;

    // Term filter
    if (termFilter !== 'All Terms' && report.term !== termFilter) return false;

    // Status filter
    if (statusFilter !== 'All Status') {
      const statusMatch =
        (statusFilter === 'Passed' && report.status === 'pass') ||
        (statusFilter === 'Failed' && report.status === 'fail');
      if (!statusMatch) return false;
    }

    return true;
  });

  // Group reports by year
  const reportsByYear = filteredReports.reduce((acc, report) => {
    if (!acc[report.year]) {
      acc[report.year] = [];
    }
    acc[report.year].push(report);
    return acc;
  }, {} as Record<string, ReportHistoryItem[]>);

  const years = Object.keys(reportsByYear).sort((a, b) => Number(b) - Number(a));
  const handleViewReport = (report: ReportHistoryItem) => {
    router.push({
      pathname: '/report-details',
      params: {
        reportId: report.id,
        childName,
        childClass,
        examType: report.examType,
        term: report.term,
        year: report.year,
        totalPercentage: report.totalPercentage.toString(),
        rank: report.rank.toString(),
        totalStudents: report.totalStudents.toString(),
        status: report.status,
        datePublished: report.datePublished,
        subjects: report.subjects.toString(),
      },
    });
  };

  // Active filter count
  const activeFilterCount =
    (yearFilter !== 'All Years' ? 1 : 0) +
    (termFilter !== 'All Terms' ? 1 : 0) +
    (statusFilter !== 'All Status' ? 1 : 0);

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
        <Text style={[styles.fixedHeaderTitle, { color: colors.text }]}>Reports History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Full Page ScrollView */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContentFull}
        showsVerticalScrollIndicator={false}
        onTouchStart={() => openDropdown && setOpenDropdown(null)}
      >
        {/* Header with Child Info - Modern Sleek Design */}
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
                gradient="purple"
                enlargeOnPress
              />

              {/* Name and Class */}
              <View style={styles.tabletNameSection}>
                <Text style={[styles.tabletProfileName, { color: colors.text }]}>{childName}</Text>
                <View style={[styles.tabletClassBadge, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="school" size={13} color={colors.primary} />
                  <Text style={[styles.tabletClassText, { color: colors.primary }]}>{childClass}</Text>
                </View>
              </View>

              {/* Child Switcher - Only show if multiple children */}
              {MOCK_CHILDREN.length > 1 && (
                <View style={styles.childSwitcherContainer}>
                  <ChildSwitcher
                    childList={MOCK_CHILDREN}
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
                gradient="purple"
                showOnlineIndicator
                enlargeOnPress
              />

              {/* Name and Class */}
              <View style={styles.profileDetails}>
                <Text style={[styles.profileName, { color: colors.text }]}>{childName}</Text>
                <View style={[styles.classBadge, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="school" size={12} color={colors.primary} />
                  <Text style={[styles.classBadgeText, { color: colors.primary }]}>{childClass}</Text>
                </View>
              </View>

              {/* Child Switcher - Only show if multiple children */}
              {MOCK_CHILDREN.length > 1 && (
                <View style={styles.mobileChildSwitcherContainer}>
                  <ChildSwitcher
                    childList={MOCK_CHILDREN}
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

        {/* Search and Filter Bar - Tablet has inline filters */}
        {isTablet ? (
          /* TABLET: Search and filter chips on one line */
          <View style={styles.tabletSearchFilterContainer}>
            {/* Search Input - Left side */}
            <View style={[styles.tabletSearchInput, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.searchIconWrap, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="search" size={14} color={colors.primary} />
              </View>
              <TextInput
                style={{ flex: 1, fontSize: 14, fontFamily: FONTS.medium, color: colors.text, marginLeft: 10, paddingVertical: 0 }}
                placeholder="Search reports..."
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

            {/* Filter Chips - Right side */}
            <View style={styles.tabletFilterChips}>
              {/* Year Filter Chip with Dropdown */}
              <View style={styles.tabletFilterChipWrapper} onTouchStart={(e) => e.stopPropagation()}>
                <Pressable
                  style={[
                    styles.tabletFilterChip,
                    {
                      backgroundColor: yearFilter !== 'All Years' ? colors.primaryLight : colors.surface,
                      borderColor: yearFilter !== 'All Years' ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                >
                  <Ionicons name="calendar-outline" size={16} color={yearFilter !== 'All Years' ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.tabletFilterChipText, { color: yearFilter !== 'All Years' ? colors.primary : colors.text }]}>
                    {yearFilter === 'All Years' ? 'Year' : yearFilter}
                  </Text>
                  <Ionicons name={openDropdown === 'year' ? 'chevron-up' : 'chevron-down'} size={14} color={yearFilter !== 'All Years' ? colors.primary : colors.textMuted} />
                </Pressable>
                {openDropdown === 'year' && (
                  <View style={[styles.tabletDropdownMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {YEAR_OPTIONS.map((option, idx) => (
                      <Pressable
                        key={option}
                        style={[styles.tabletDropdownOption, yearFilter === option && { backgroundColor: colors.primaryLight }, idx === 0 && styles.tabletDropdownOptionFirst]}
                        onPress={() => { setYearFilter(option); setOpenDropdown(null); }}
                      >
                        <Text style={[styles.tabletDropdownOptionText, { color: yearFilter === option ? colors.primary : colors.text }]}>{option}</Text>
                        {yearFilter === option && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Term Filter Chip with Dropdown */}
              <View style={styles.tabletFilterChipWrapper} onTouchStart={(e) => e.stopPropagation()}>
                <Pressable
                  style={[
                    styles.tabletFilterChip,
                    {
                      backgroundColor: termFilter !== 'All Terms' ? colors.primaryLight : colors.surface,
                      borderColor: termFilter !== 'All Terms' ? colors.primary : colors.border
                    }
                  ]}
                  onPress={() => setOpenDropdown(openDropdown === 'term' ? null : 'term')}
                >
                  <Ionicons name="book-outline" size={16} color={termFilter !== 'All Terms' ? colors.primary : colors.textSecondary} />
                  <Text style={[styles.tabletFilterChipText, { color: termFilter !== 'All Terms' ? colors.primary : colors.text }]}>
                    {termFilter === 'All Terms' ? 'Term' : termFilter}
                  </Text>
                  <Ionicons name={openDropdown === 'term' ? 'chevron-up' : 'chevron-down'} size={14} color={termFilter !== 'All Terms' ? colors.primary : colors.textMuted} />
                </Pressable>
                {openDropdown === 'term' && (
                  <View style={[styles.tabletDropdownMenu, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {TERM_OPTIONS.map((option, idx) => (
                      <Pressable
                        key={option}
                        style={[styles.tabletDropdownOption, termFilter === option && { backgroundColor: colors.primaryLight }, idx === 0 && styles.tabletDropdownOptionFirst]}
                        onPress={() => { setTermFilter(option); setOpenDropdown(null); }}
                      >
                        <Text style={[styles.tabletDropdownOptionText, { color: termFilter === option ? colors.primary : colors.text }]}>{option}</Text>
                        {termFilter === option && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Status Filter Chip with Dropdown */}
              <View style={styles.tabletFilterChipWrapper} onTouchStart={(e) => e.stopPropagation()}>
                <Pressable
                  style={[
                    styles.tabletFilterChip,
                    {
                      backgroundColor: statusFilter !== 'All Status' ? (statusFilter === 'Passed' ? '#ecfdf5' : '#fef2f2') : colors.surface,
                      borderColor: statusFilter !== 'All Status' ? (statusFilter === 'Passed' ? '#10b981' : '#ef4444') : colors.border
                    }
                  ]}
                  onPress={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                >
                  <Ionicons
                    name={statusFilter === 'Passed' ? 'checkmark-circle-outline' : statusFilter === 'Failed' ? 'close-circle-outline' : 'funnel-outline'}
                    size={16}
                    color={statusFilter !== 'All Status' ? (statusFilter === 'Passed' ? '#10b981' : '#ef4444') : colors.textSecondary}
                  />
                  <Text style={[styles.tabletFilterChipText, { color: statusFilter !== 'All Status' ? (statusFilter === 'Passed' ? '#059669' : '#dc2626') : colors.text }]}>
                    {statusFilter === 'All Status' ? 'Status' : statusFilter}
                  </Text>
                  <Ionicons name={openDropdown === 'status' ? 'chevron-up' : 'chevron-down'} size={14} color={statusFilter !== 'All Status' ? (statusFilter === 'Passed' ? '#10b981' : '#ef4444') : colors.textMuted} />
                </Pressable>
                {openDropdown === 'status' && (
                  <View style={[styles.tabletDropdownMenuRight, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    {STATUS_OPTIONS.map((option, idx) => (
                      <Pressable
                        key={option}
                        style={[styles.tabletDropdownOption, statusFilter === option && { backgroundColor: colors.primaryLight }, idx === 0 && styles.tabletDropdownOptionFirst]}
                        onPress={() => { setStatusFilter(option); setOpenDropdown(null); }}
                      >
                        <Text style={[styles.tabletDropdownOptionText, { color: statusFilter === option ? colors.primary : colors.text }]}>{option}</Text>
                        {statusFilter === option && <Ionicons name="checkmark" size={18} color={colors.primary} />}
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Clear Filters Button - Only show if filters active */}
              {hasActiveFilters && (
                <Pressable
                  style={[styles.tabletClearFilters, { backgroundColor: colors.backgroundTertiary }]}
                  onPress={resetFilters}
                >
                  <Ionicons name="close" size={16} color={colors.textSecondary} />
                  <Text style={[styles.tabletClearFiltersText, { color: colors.textSecondary }]}>Clear</Text>
                </Pressable>
              )}
            </View>
          </View>
        ) : (
          /* MOBILE: Original stacked layout */
          <>
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: colors.background }}>
            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: 14, height: 48, paddingHorizontal: 12 }}>
              <View style={[styles.searchIconWrap, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="search" size={14} color={colors.primary} />
              </View>
              <TextInput
                style={{ flex: 1, fontSize: 14, fontFamily: FONTS.medium, color: colors.text, marginLeft: 10, paddingVertical: 0 }}
                placeholder="Search reports..."
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
              style={{ width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center', borderWidth: 1, marginLeft: 12, backgroundColor: showFilters || activeFilterCount > 0 ? colors.primary : colors.surface, borderColor: showFilters || activeFilterCount > 0 ? colors.primary : colors.border }}
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

          {/* Filter Panel - Mobile Only */}
          {showFilters && (
            <View style={[styles.filterPanel, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {/* Filter Header */}
              <View style={styles.filterPanelHeader}>
                <Text style={[styles.filterPanelTitle, { color: colors.text }]}>Filter by</Text>
                {hasActiveFilters && (
                  <Pressable
                    onPress={resetFilters}
                    style={[styles.resetButton, { backgroundColor: colors.backgroundTertiary }]}
                  >
                    <Ionicons name="refresh-outline" size={14} color={colors.textSecondary} />
                    <Text style={[styles.resetButtonText, { color: colors.textSecondary }]}>Clear all</Text>
                  </Pressable>
                )}
              </View>

              {/* Filter Dropdowns - Stacked vertically */}
              <View>
                <FilterDropdown
                  label="Year"
                  value={yearFilter}
                  options={YEAR_OPTIONS}
                  onSelect={setYearFilter}
                  isOpen={openDropdown === 'year'}
                  onToggle={() => setOpenDropdown(openDropdown === 'year' ? null : 'year')}
                  colors={colors}
              />
              <FilterDropdown
                label="Term"
                value={termFilter}
                options={TERM_OPTIONS}
                onSelect={setTermFilter}
                isOpen={openDropdown === 'term'}
                onToggle={() => setOpenDropdown(openDropdown === 'term' ? null : 'term')}
                colors={colors}
              />
              <FilterDropdown
                label="Status"
                value={statusFilter}
                options={STATUS_OPTIONS}
                onSelect={setStatusFilter}
                isOpen={openDropdown === 'status'}
                onToggle={() => setOpenDropdown(openDropdown === 'status' ? null : 'status')}
                colors={colors}
              />
            </View>
          </View>
        )}
        </>
        )}

        {/* Results Count */}
        {hasActiveFilters && (
          <View style={[styles.resultsCount, { backgroundColor: colors.backgroundSecondary }]}>
            <Text style={[styles.resultsCountText, { color: colors.textSecondary }]}>
              Showing {filteredReports.length} of {MOCK_REPORT_HISTORY.length} reports
            </Text>
          </View>
        )}

        {/* Reports List Content */}
        <View style={[styles.reportsListContainer, isTablet && styles.reportsListContainerTablet]}>

        {/* Collapsible Performance Summary Section */}
        {(() => {
          // Calculate ALL-TIME cumulative stats from all reports
          const allTimeAvgScore = MOCK_REPORT_HISTORY.length > 0
            ? Math.round(MOCK_REPORT_HISTORY.reduce((sum, r) => sum + r.totalPercentage, 0) / MOCK_REPORT_HISTORY.length)
            : 0;
          const bestScore = MOCK_REPORT_HISTORY.length > 0
            ? Math.max(...MOCK_REPORT_HISTORY.map(r => r.totalPercentage))
            : 0;
          const allTimeAvgAttendance = MOCK_REPORT_HISTORY.length > 0
            ? Math.round(MOCK_REPORT_HISTORY.reduce((sum, r) => sum + r.attendance, 0) / MOCK_REPORT_HISTORY.length)
            : 0;
          // Get the most recent conduct grade
          const allTimeConduct = MOCK_REPORT_HISTORY[0]?.conduct || 'A';

          return (
            <View style={[styles.performanceSummaryContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              {/* Collapsible Header */}
              <Pressable
                style={styles.performanceSummaryHeader}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setSummaryExpanded(!summaryExpanded);
                }}
              >
                <View style={styles.performanceSummaryHeaderLeft}>
                  <View style={[styles.performanceSummaryIcon, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="stats-chart" size={16} color={colors.primary} />
                  </View>
                  <View>
                    <Text style={[styles.performanceSummaryTitle, { color: colors.text }]}>Performance Summary</Text>
                    <Text style={[styles.performanceSummarySubtitle, { color: colors.textMuted }]}>
                      All-time averages across {MOCK_REPORT_HISTORY.length} reports
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name={summaryExpanded ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.textMuted}
                />
              </Pressable>

              {/* Expandable Content */}
              {summaryExpanded && (
                <>
                  {/* All-Time Stats Cards - Tablet */}
                  {isTablet && (
                    <View style={[styles.tabletStatsCardsRow, { paddingHorizontal: 16, paddingBottom: 16 }]}>
                      {/* All-Time Average Card */}
                      <View style={[styles.tabletStatCard, { backgroundColor: isDark ? colors.surface : '#ecfdf5', borderColor: isDark ? colors.border : '#a7f3d0' }]}>
                        <View style={styles.tabletStatCardTop}>
                          <Text style={[styles.tabletStatCardLabel, { color: isDark ? colors.success : '#059669' }]}>All-Time Avg</Text>
                          <View style={[styles.tabletStatCardIcon, { backgroundColor: isDark ? colors.successLight : '#a7f3d0' }]}>
                            <Ionicons name="trending-up" size={16} color={isDark ? colors.success : '#059669'} />
                          </View>
                        </View>
                        <Text style={[styles.tabletStatCardValue, { color: isDark ? colors.text : '#064e3b' }]}>{allTimeAvgScore}%</Text>
                      </View>

                      {/* Best Score Card */}
                      <View style={[styles.tabletStatCard, { backgroundColor: isDark ? colors.surface : '#fef3c7', borderColor: isDark ? colors.border : '#fcd34d' }]}>
                        <View style={styles.tabletStatCardTop}>
                          <Text style={[styles.tabletStatCardLabel, { color: isDark ? colors.warning : '#d97706' }]}>Best Score</Text>
                          <View style={[styles.tabletStatCardIcon, { backgroundColor: isDark ? colors.warningLight : '#fcd34d' }]}>
                            <Ionicons name="star" size={16} color={isDark ? colors.warning : '#d97706'} />
                          </View>
                        </View>
                        <Text style={[styles.tabletStatCardValue, { color: isDark ? colors.text : '#78350f' }]}>{bestScore}%</Text>
                      </View>

                      {/* Avg Attendance Card */}
                      <View style={[styles.tabletStatCard, { backgroundColor: isDark ? colors.surface : '#eef2ff', borderColor: isDark ? colors.border : '#c7d2fe' }]}>
                        <View style={styles.tabletStatCardTop}>
                          <Text style={[styles.tabletStatCardLabel, { color: isDark ? colors.primary : '#6366f1' }]}>Avg Attendance</Text>
                          <View style={[styles.tabletStatCardIcon, { backgroundColor: isDark ? colors.primaryLight : '#c7d2fe' }]}>
                            <Ionicons name="time-outline" size={16} color={isDark ? colors.primary : '#6366f1'} />
                          </View>
                        </View>
                        <Text style={[styles.tabletStatCardValue, { color: isDark ? colors.text : '#1e1b4b' }]}>{allTimeAvgAttendance}%</Text>
                      </View>

                      {/* Recent Conduct Card */}
                      <View style={[styles.tabletStatCard, { backgroundColor: isDark ? colors.surface : '#fce7f3', borderColor: isDark ? colors.border : '#f9a8d4' }]}>
                        <View style={styles.tabletStatCardTop}>
                          <Text style={[styles.tabletStatCardLabel, { color: isDark ? colors.accent : '#db2777' }]}>Last Conduct</Text>
                          <View style={[styles.tabletStatCardIcon, { backgroundColor: isDark ? colors.accentLight : '#f9a8d4' }]}>
                            <Ionicons name="ribbon-outline" size={16} color={isDark ? colors.accent : '#db2777'} />
                          </View>
                        </View>
                        <Text style={[styles.tabletStatCardValue, { color: isDark ? colors.text : '#831843' }]}>{allTimeConduct}</Text>
                      </View>
                    </View>
                  )}

                  {/* All-Time Stats Cards - Mobile */}
                  {!isTablet && (
                    <View style={[styles.mobileYearStatsRow, { paddingHorizontal: 16, paddingBottom: 16 }]}>
                      {/* All-Time Average Card */}
                      <View style={[styles.mobileYearStatCard, { backgroundColor: isDark ? colors.surface : '#ecfdf5', borderColor: isDark ? colors.border : '#a7f3d0' }]}>
                        <View style={styles.mobileYearStatCardTop}>
                          <Text style={[styles.mobileYearStatCardLabel, { color: isDark ? colors.success : '#059669' }]}>All-Time Avg</Text>
                          <View style={[styles.mobileYearStatCardIcon, { backgroundColor: isDark ? colors.successLight : '#a7f3d0' }]}>
                            <Ionicons name="trending-up" size={12} color={isDark ? colors.success : '#059669'} />
                          </View>
                        </View>
                        <Text style={[styles.mobileYearStatCardValue, { color: isDark ? colors.text : '#064e3b' }]}>{allTimeAvgScore}%</Text>
                      </View>

                      {/* Best Score Card */}
                      <View style={[styles.mobileYearStatCard, { backgroundColor: isDark ? colors.surface : '#fef3c7', borderColor: isDark ? colors.border : '#fcd34d' }]}>
                        <View style={styles.mobileYearStatCardTop}>
                          <Text style={[styles.mobileYearStatCardLabel, { color: isDark ? colors.warning : '#d97706' }]}>Best Score</Text>
                          <View style={[styles.mobileYearStatCardIcon, { backgroundColor: isDark ? colors.warningLight : '#fcd34d' }]}>
                            <Ionicons name="star" size={12} color={isDark ? colors.warning : '#d97706'} />
                          </View>
                        </View>
                        <Text style={[styles.mobileYearStatCardValue, { color: isDark ? colors.text : '#78350f' }]}>{bestScore}%</Text>
                      </View>

                      {/* Avg Attendance Card */}
                      <View style={[styles.mobileYearStatCard, { backgroundColor: isDark ? colors.surface : '#eef2ff', borderColor: isDark ? colors.border : '#c7d2fe' }]}>
                        <View style={styles.mobileYearStatCardTop}>
                          <Text style={[styles.mobileYearStatCardLabel, { color: isDark ? colors.primary : '#6366f1' }]}>Avg Attendance</Text>
                          <View style={[styles.mobileYearStatCardIcon, { backgroundColor: isDark ? colors.primaryLight : '#c7d2fe' }]}>
                            <Ionicons name="time-outline" size={12} color={isDark ? colors.primary : '#6366f1'} />
                          </View>
                        </View>
                        <Text style={[styles.mobileYearStatCardValue, { color: isDark ? colors.text : '#1e1b4b' }]}>{allTimeAvgAttendance}%</Text>
                      </View>

                      {/* Recent Conduct Card */}
                      <View style={[styles.mobileYearStatCard, { backgroundColor: isDark ? colors.surface : '#fce7f3', borderColor: isDark ? colors.border : '#f9a8d4' }]}>
                        <View style={styles.mobileYearStatCardTop}>
                          <Text style={[styles.mobileYearStatCardLabel, { color: isDark ? colors.accent : '#db2777' }]}>Last Conduct</Text>
                          <View style={[styles.mobileYearStatCardIcon, { backgroundColor: isDark ? colors.accentLight : '#f9a8d4' }]}>
                            <Ionicons name="ribbon-outline" size={12} color={isDark ? colors.accent : '#db2777'} />
                          </View>
                        </View>
                        <Text style={[styles.mobileYearStatCardValue, { color: isDark ? colors.text : '#831843' }]}>{allTimeConduct}</Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
          );
        })()}

        {/* Past Reports Section */}
        {filteredReports.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={[styles.emptyStateIcon, { backgroundColor: colors.backgroundTertiary }]}>
              <Ionicons name="document-text-outline" size={48} color={colors.textMuted} />
            </View>
            <Text style={[styles.emptyStateTitle, { color: colors.text }]}>No Reports Found</Text>
            <Text style={[styles.emptyStateText, { color: colors.textMuted }]}>
              Try adjusting your search or filters
            </Text>
            {hasActiveFilters && (
              <Pressable
                style={[styles.clearFiltersButton, { backgroundColor: colors.primary }]}
                onPress={resetFilters}
              >
                <Text style={styles.clearFiltersButtonText}>Clear All Filters</Text>
              </Pressable>
            )}
          </View>
        ) : (
          <>
          {/* Past Reports Header */}
          <View style={styles.pastReportsHeader}>
            <Text style={[styles.pastReportsTitle, { color: colors.text }]}>Past Reports</Text>
            <Text style={[styles.pastReportsCount, { color: colors.textMuted }]}>
              {filteredReports.length} completed
            </Text>
          </View>

          {years.map((year) => {
            const yearReports = reportsByYear[year];

            return (
            <View key={year} style={styles.yearSection}>
              {/* Year Header */}
              <View style={styles.yearHeader}>
                <View style={[styles.yearBadge, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="calendar" size={14} color={colors.primary} />
                  <Text style={[styles.yearText, { color: colors.primary }]}>{year}</Text>
                </View>
                <View style={[styles.yearLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.yearCount, { color: colors.textMuted }]}>
                  {yearReports.length} report{yearReports.length > 1 ? 's' : ''}
                </Text>
              </View>

              {/* Report Cards Grid */}
              <View style={[styles.reportsGrid, isTablet && styles.reportsGridTablet]}>
                {reportsByYear[year].map((report, _index) => (
                  <Pressable
                    key={report.id}
                    style={[
                      styles.reportCard,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isTablet && styles.reportCardTablet,
                    ]}
                    onPress={() => handleViewReport(report)}
                  >
                    {/* Card Header with Score */}
                    <View style={styles.reportCardHeader}>
                      <View style={styles.reportCardHeaderLeft}>
                        <View
                          style={[
                            styles.termBadge,
                            { backgroundColor: colors.backgroundTertiary },
                          ]}
                        >
                          <Text style={[styles.termBadgeText, { color: colors.textSecondary }]}>
                            {report.term}
                          </Text>
                        </View>
                        <Text style={[styles.reportExamType, { color: colors.text }]}>
                          {report.examType}
                        </Text>
                      </View>
                      <LinearGradient
                        colors={getScoreGradient(report.totalPercentage)}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.scoreCircle}
                      >
                        <Text style={styles.scoreCircleText}>{report.totalPercentage}%</Text>
                      </LinearGradient>
                    </View>

                    {/* Term Stats Cards - 2x2 Grid */}
                    <View style={[styles.termStatsGrid, { backgroundColor: colors.backgroundSecondary }]}>
                      {/* Average Card */}
                      <View style={[styles.termStatCard, { backgroundColor: '#f0fdf4' }]}>
                        <View style={styles.termStatCardTop}>
                          <Text style={[styles.termStatCardLabel, { color: '#16a34a' }]}>Average</Text>
                          <View style={[styles.termStatCardIcon, { backgroundColor: '#dcfce7' }]}>
                            <Ionicons name="analytics" size={isTablet ? 12 : 10} color="#16a34a" />
                          </View>
                        </View>
                        <Text style={[styles.termStatCardValue, { color: '#14532d' }]}>{report.totalPercentage}%</Text>
                      </View>

                      {/* Position Card */}
                      <View style={[styles.termStatCard, { backgroundColor: '#fefce8' }]}>
                        <View style={styles.termStatCardTop}>
                          <Text style={[styles.termStatCardLabel, { color: '#ca8a04' }]}>Position</Text>
                          <View style={[styles.termStatCardIcon, { backgroundColor: '#fef9c3' }]}>
                            <Ionicons name="trophy" size={isTablet ? 12 : 10} color="#ca8a04" />
                          </View>
                        </View>
                        <Text style={[styles.termStatCardValue, { color: '#713f12' }]}>#{report.rank}</Text>
                        <Text style={[styles.termStatCardSubtext, { color: '#854d0e' }]}>of {report.totalStudents}</Text>
                      </View>

                      {/* Attendance Card */}
                      <View style={[styles.termStatCard, { backgroundColor: '#eef2ff' }]}>
                        <View style={styles.termStatCardTop}>
                          <Text style={[styles.termStatCardLabel, { color: '#6366f1' }]}>Attendance</Text>
                          <View style={[styles.termStatCardIcon, { backgroundColor: '#e0e7ff' }]}>
                            <Ionicons name="calendar-outline" size={isTablet ? 12 : 10} color="#6366f1" />
                          </View>
                        </View>
                        <Text style={[styles.termStatCardValue, { color: '#1e1b4b' }]}>{report.attendance}%</Text>
                      </View>

                      {/* Conduct Card */}
                      <View style={[styles.termStatCard, { backgroundColor: '#fdf2f8' }]}>
                        <View style={styles.termStatCardTop}>
                          <Text style={[styles.termStatCardLabel, { color: '#db2777' }]}>Conduct</Text>
                          <View style={[styles.termStatCardIcon, { backgroundColor: '#fce7f3' }]}>
                            <Ionicons name="ribbon" size={isTablet ? 12 : 10} color="#db2777" />
                          </View>
                        </View>
                        <Text style={[styles.termStatCardValue, { color: '#831843' }]}>{report.conduct}</Text>
                      </View>
                    </View>

                    {/* Info Row */}
                    <View style={[styles.reportInfoRow, { backgroundColor: colors.surface }]}>
                      <View style={styles.reportInfoItem}>
                        <Ionicons name="book-outline" size={14} color={colors.textMuted} />
                        <Text style={[styles.reportInfoValue, { color: colors.text }]}>
                          {report.subjects}
                        </Text>
                        <Text style={[styles.reportInfoLabel, { color: colors.textMuted }]}>
                          subjects
                        </Text>
                      </View>
                      <View style={[styles.reportInfoDivider, { backgroundColor: colors.border }]} />
                      <View style={styles.reportInfoItem}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                        <Text style={[styles.reportInfoValue, { color: colors.text }]}>
                          {formatShortDate(report.datePublished)}
                        </Text>
                      </View>
                    </View>

                    {/* Card Footer */}
                    <View style={styles.reportCardFooter}>
                      <View
                        style={[
                          styles.statusBadge,
                          {
                            backgroundColor:
                              report.status === 'pass' ? '#ecfdf5' : '#fef2f2',
                          },
                        ]}
                      >
                        <View
                          style={[
                            styles.statusDot,
                            {
                              backgroundColor:
                                report.status === 'pass' ? '#10b981' : '#ef4444',
                            },
                          ]}
                        />
                        <Text
                          style={[
                            styles.statusText,
                            { color: report.status === 'pass' ? '#059669' : '#dc2626' },
                          ]}
                        >
                          {report.status === 'pass' ? 'Passed' : 'Failed'}
                        </Text>
                      </View>
                      <View style={styles.viewDetailsButton}>
                        <Text style={[styles.viewDetailsText, { color: colors.primary }]}>
                          View Details
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                      </View>
                    </View>
                  </Pressable>
                ))}
              </View>
            </View>
          );
          })}
          </>
        )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  // Fixed Header
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
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  // Scroll Content
  scrollContentFull: {
    flexGrow: 1,
  },
  // Modern Header Container
  headerContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
    overflow: 'visible',
    zIndex: 50,
  },
  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'visible',
    zIndex: 50,
  },
  profileSectionTablet: {
    justifyContent: 'flex-start',
    marginBottom: 20,
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
  // Mobile Avatar Pressable for enlargement
  mobileAvatarPressable: {
    cursor: 'pointer',
    zIndex: 1,
  },
  mobileAvatarEnlarged: {
    transform: [{ scale: 2.5 }, { translateX: 23 }, { translateY: 18 }],
    zIndex: 1000,
    elevation: 20,
  },
  // Mobile Stats Cards - Tablet-Style Design
  mobileStatsCardsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  mobileStatCard: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    minHeight: 80,
  },
  mobileStatCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  mobileStatCardLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  mobileStatCardIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileStatCardValue: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  // No Stats Empty State
  noStatsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 16,
  },
  noStatsText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  noStatsContainerMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  noStatsTextMobile: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  // Mobile Year Stats Cards (per year section)
  mobileYearStatsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
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
    fontSize: 18,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  // Collapsible Performance Summary
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
  // Past Reports Header
  pastReportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 8,
  },
  pastReportsTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  pastReportsCount: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  // Avatar with gradient ring
  avatarContainer: {
    position: 'relative',
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
  // Profile Details
  profileDetails: {
    marginLeft: 14,
    flex: 1,
  },
  profileDetailsTablet: {
    flex: 0,
    marginRight: 40,
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
  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statsRowTablet: {
    gap: 16,
    maxWidth: 500,
  },
  // Individual Stat Card
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  statIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    lineHeight: 20,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 1,
  },
  // Search and Filter - Modern Design (same line layout)
  searchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    flexWrap: 'nowrap',
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
    flexShrink: 0,
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
  // Filter Panel - Modern
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
    gap: 12,
  },
  filterGridTablet: {
    flexDirection: 'row',
    gap: 12,
  },
  // Modern Filter Dropdown
  filterDropdownContainer: {
    flex: 1,
    zIndex: 100,
  },
  filterDropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 10,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    minHeight: 56,
  },
  filterDropdownContent: {
    flex: 1,
  },
  filterDropdownLabel: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  filterDropdownValue: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  filterDropdownIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterDropdownMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
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
  filterDropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  filterDropdownOptionFirst: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  filterDropdownOptionLast: {
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
  },
  filterDropdownOptionText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
  filterCheckIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Filter Chip
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
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
  // Scroll Content
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  scrollContentTablet: {
    paddingHorizontal: 24,
  },
  // Reports List Container
  reportsListContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  reportsListContainerTablet: {
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
  // Reports Grid
  reportsGrid: {
    gap: 12,
  },
  reportsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  // Report Card
  reportCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  reportCardTablet: {
    width: (SCREEN_WIDTH - 48 - 16) / 2,
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
  },
  reportCardHeaderLeft: {
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
  reportExamType: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  scoreCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircleText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: '#ffffff',
  },
  // Term Stats Grid - Per Report Card
  termStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
    borderRadius: 0,
  },
  termStatCard: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  termStatCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  termStatCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  termStatCardIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  termStatCardValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  termStatCardSubtext: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  // Report Info Row
  reportInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  reportInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportInfoValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  reportInfoLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  reportInfoDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 8,
  },
  // Report Stats Row (legacy)
  reportStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderTopWidth: 1,
  },
  reportStatItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportStatValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  reportStatLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  reportStatDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 8,
  },
  // Report Card Footer
  reportCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewDetailsText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    marginBottom: 20,
  },
  clearFiltersButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  clearFiltersButtonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },

  // =============================================
  // TABLET HEADER STYLES - Modern Sleek Design
  // =============================================
  tabletHeaderWrapper: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 4,
    overflow: 'visible',
    zIndex: 50,
  },
  tabletProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
    overflow: 'visible',
    zIndex: 50,
  },
  tabletAvatarPressable: {
    cursor: 'pointer',
    zIndex: 1,
  },
  tabletAvatarWrapper: {
    transform: [{ scale: 1 }],
  },
  tabletAvatarEnlarged: {
    transform: [{ scale: 2.5 }, { translateX: 27 }, { translateY: 18 }],
    zIndex: 1000,
    elevation: 20,
  },
  tabletAvatarGradient: {
    width: 72,
    height: 72,
    borderRadius: 36,
    padding: 3,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
    gap: 6,
  },
  tabletProfileName: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  tabletClassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    gap: 6,
    alignSelf: 'flex-start',
  },
  tabletClassText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  // Stats Cards Row - Like the reference image
  tabletStatsCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tabletStatCard: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    minHeight: 100,
  },
  tabletStatCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabletStatCardLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  tabletStatCardIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletStatCardValue: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  tabletStatCardSubtext: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },

  // =============================================
  // TABLET FILTER STYLES - Modern Inline Design
  // =============================================
  tabletSearchFilterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 12,
  },
  tabletSearchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    height: 44,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabletFilterChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  tabletFilterChipWrapper: {
    position: 'relative',
    zIndex: 10,
  },
  tabletFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 6,
    height: 44,
  },
  tabletFilterChipText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  tabletClearFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
    height: 36,
  },
  tabletClearFiltersText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  tabletDropdownMenu: {
    position: 'absolute',
    top: 48,
    left: 0,
    minWidth: 140,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    zIndex: 100,
  },
  tabletDropdownMenuRight: {
    position: 'absolute',
    top: 48,
    right: 0,
    minWidth: 140,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 12,
    overflow: 'hidden',
    zIndex: 100,
  },
  tabletDropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  tabletDropdownOptionFirst: {
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
  },
  tabletDropdownOptionText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
});
