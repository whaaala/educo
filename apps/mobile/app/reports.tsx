import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

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
  },
];

// Filter options
const YEAR_OPTIONS = ['All Years', '2024', '2023', '2022'];
const TERM_OPTIONS = ['All Terms', 'Term 1', 'Term 2', 'Term 3'];
const STATUS_OPTIONS = ['All Status', 'Passed', 'Failed'];

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

function getScoreColor(percentage: number) {
  if (percentage >= 70) return '#10b981';
  if (percentage >= 50) return '#f59e0b';
  return '#ef4444';
}

function getScoreGradient(percentage: number): readonly [string, string] {
  if (percentage >= 70) return ['#10b981', '#059669'] as const;
  if (percentage >= 50) return ['#f59e0b', '#d97706'] as const;
  return ['#ef4444', '#dc2626'] as const;
}

function getScoreBgColor(percentage: number) {
  if (percentage >= 70) return '#ecfdf5';
  if (percentage >= 50) return '#fffbeb';
  return '#fef2f2';
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

// Filter Chip Component
function FilterChip({
  label,
  selected,
  onPress,
  colors,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
  colors: any;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        {
          backgroundColor: selected ? colors.primary : colors.backgroundTertiary,
          borderColor: selected ? colors.primary : colors.border,
        },
      ]}
    >
      <Text
        style={[
          styles.filterChipText,
          { color: selected ? '#ffffff' : colors.textSecondary },
        ]}
      >
        {label}
      </Text>
      {selected && (
        <Ionicons name="checkmark" size={14} color="#ffffff" style={{ marginLeft: 4 }} />
      )}
    </Pressable>
  );
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
  colors: any;
}) {
  const isSelected = value !== options[0];

  return (
    <View style={{ marginBottom: 8 }}>
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
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isTablet = useIsTablet();

  const childId = params.childId as string | undefined;
  const childName = (params.childName as string) || 'Student';
  const childAvatar = 'https://i.pravatar.cc/150?u=adaeze';
  const childClass = 'JSS 2';

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [yearFilter, setYearFilter] = useState('All Years');
  const [termFilter, setTermFilter] = useState('All Terms');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Animation values
  const filterHeight = useRef(new Animated.Value(0)).current;
  const searchFocused = useRef(new Animated.Value(0)).current;

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

  // Calculate summary stats
  const avgScore = Math.round(
    MOCK_REPORT_HISTORY.reduce((sum, r) => sum + r.totalPercentage, 0) /
      MOCK_REPORT_HISTORY.length
  );
  const avgRank = Math.round(
    MOCK_REPORT_HISTORY.reduce((sum, r) => sum + r.rank, 0) / MOCK_REPORT_HISTORY.length
  );
  const passCount = MOCK_REPORT_HISTORY.filter((r) => r.status === 'pass').length;
  const totalReports = MOCK_REPORT_HISTORY.length;

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
      >
        {/* Header with Child Info - Modern Subtle Design */}
        <View style={[styles.headerContainer, { backgroundColor: colors.background }]}>
          {/* Child Profile Section */}
          <View style={[styles.profileSection, isTablet && styles.profileSectionTablet]}>
            {/* Avatar with gradient ring */}
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarRing}
              >
                <View style={[styles.avatarInner, { backgroundColor: colors.background }]}>
                  <Image source={{ uri: childAvatar }} style={styles.avatarImage} />
                </View>
              </LinearGradient>
              {/* Online indicator */}
              <View style={[styles.onlineIndicator, { borderColor: colors.background }]} />
            </View>

            {/* Name and Class */}
            <View style={[styles.profileDetails, isTablet && styles.profileDetailsTablet]}>
              <Text style={[styles.profileName, { color: colors.text }]}>{childName}</Text>
              <View style={[styles.classBadge, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="school" size={12} color={colors.primary} />
                <Text style={[styles.classBadgeText, { color: colors.primary }]}>{childClass}</Text>
              </View>
            </View>
          </View>

          {/* Stats Cards Row */}
          <View style={[styles.statsRow, isTablet && styles.statsRowTablet]}>
            {/* Reports Count */}
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#f0f9ff' }]}>
                <Ionicons name="document-text" size={18} color="#0ea5e9" />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>{totalReports}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Reports</Text>
              </View>
            </View>

            {/* Average Score */}
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#f0fdf4' }]}>
                <Ionicons name="trending-up" size={18} color="#22c55e" />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>{avgScore}%</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Avg Score</Text>
              </View>
            </View>

            {/* Average Rank */}
            <View style={[styles.statCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.statIconContainer, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="trophy" size={18} color="#f59e0b" />
              </View>
              <View style={styles.statContent}>
                <Text style={[styles.statValue, { color: colors.text }]}>#{avgRank}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>Avg Rank</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Search and Filter Bar - Same Line */}
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

        {/* Filter Panel - Modern Expandable */}
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
          years.map((year) => (
            <View key={year} style={styles.yearSection}>
              {/* Year Header */}
              <View style={styles.yearHeader}>
                <View style={[styles.yearBadge, { backgroundColor: colors.primaryLight }]}>
                  <Ionicons name="calendar" size={14} color={colors.primary} />
                  <Text style={[styles.yearText, { color: colors.primary }]}>{year}</Text>
                </View>
                <View style={[styles.yearLine, { backgroundColor: colors.border }]} />
                <Text style={[styles.yearCount, { color: colors.textMuted }]}>
                  {reportsByYear[year].length} report{reportsByYear[year].length > 1 ? 's' : ''}
                </Text>
              </View>

              {/* Report Cards Grid */}
              <View style={[styles.reportsGrid, isTablet && styles.reportsGridTablet]}>
                {reportsByYear[year].map((report, index) => (
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

                    {/* Stats Row */}
                    <View style={[styles.reportStatsRow, { borderTopColor: colors.border }]}>
                      <View style={styles.reportStatItem}>
                        <Ionicons name="trophy-outline" size={14} color={colors.textMuted} />
                        <Text style={[styles.reportStatValue, { color: colors.text }]}>
                          #{report.rank}
                        </Text>
                        <Text style={[styles.reportStatLabel, { color: colors.textMuted }]}>
                          of {report.totalStudents}
                        </Text>
                      </View>
                      <View style={[styles.reportStatDivider, { backgroundColor: colors.border }]} />
                      <View style={styles.reportStatItem}>
                        <Ionicons name="book-outline" size={14} color={colors.textMuted} />
                        <Text style={[styles.reportStatValue, { color: colors.text }]}>
                          {report.subjects}
                        </Text>
                        <Text style={[styles.reportStatLabel, { color: colors.textMuted }]}>
                          subjects
                        </Text>
                      </View>
                      <View style={[styles.reportStatDivider, { backgroundColor: colors.border }]} />
                      <View style={styles.reportStatItem}>
                        <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                        <Text style={[styles.reportStatValue, { color: colors.text }]}>
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
          ))
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
  },
  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileSectionTablet: {
    justifyContent: 'flex-start',
    marginBottom: 20,
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
  // Report Stats Row
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
});
