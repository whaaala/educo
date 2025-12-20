import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

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
}

// Mock report history data
const MOCK_REPORT_HISTORY: ReportHistoryItem[] = [
  {
    id: 'report-001',
    examType: 'Third Term Exam',
    term: 'Term 3',
    year: '2024',
    totalPercentage: 78,
    rank: 5,
    totalStudents: 45,
    status: 'pass',
    datePublished: '2024-12-15',
  },
  {
    id: 'report-002',
    examType: 'Second Term Exam',
    term: 'Term 2',
    year: '2024',
    totalPercentage: 82,
    rank: 3,
    totalStudents: 45,
    status: 'pass',
    datePublished: '2024-08-20',
  },
  {
    id: 'report-003',
    examType: 'First Term Exam',
    term: 'Term 1',
    year: '2024',
    totalPercentage: 75,
    rank: 7,
    totalStudents: 45,
    status: 'pass',
    datePublished: '2024-04-15',
  },
  {
    id: 'report-004',
    examType: 'Third Term Exam',
    term: 'Term 3',
    year: '2023',
    totalPercentage: 72,
    rank: 9,
    totalStudents: 42,
    status: 'pass',
    datePublished: '2023-12-10',
  },
  {
    id: 'report-005',
    examType: 'Second Term Exam',
    term: 'Term 2',
    year: '2023',
    totalPercentage: 68,
    rank: 12,
    totalStudents: 42,
    status: 'pass',
    datePublished: '2023-08-15',
  },
  {
    id: 'report-006',
    examType: 'First Term Exam',
    term: 'Term 1',
    year: '2023',
    totalPercentage: 65,
    rank: 14,
    totalStudents: 42,
    status: 'pass',
    datePublished: '2023-04-12',
  },
];

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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ReportsHistoryScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isTablet = useIsTablet();

  const childId = params.childId as string | undefined;
  const childName = (params.childName as string) || 'Student';

  // Group reports by year
  const reportsByYear = MOCK_REPORT_HISTORY.reduce((acc, report) => {
    if (!acc[report.year]) {
      acc[report.year] = [];
    }
    acc[report.year].push(report);
    return acc;
  }, {} as Record<string, ReportHistoryItem[]>);

  const years = Object.keys(reportsByYear).sort((a, b) => Number(b) - Number(a));

  const handleViewReport = (reportId: string) => {
    // Navigate back to home and open the results modal with the specific report
    // For now, just go back
    router.back();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.backgroundTertiary }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Reports History</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>{childName}</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      {/* Summary Card */}
      <View style={[styles.summaryCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <LinearGradient
          colors={['#6366f1', '#4f46e5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.summaryGradient}
        >
          <View style={styles.summaryContent}>
            <View style={styles.summaryLeft}>
              <Text style={styles.summaryLabel}>Total Reports</Text>
              <Text style={styles.summaryValue}>{MOCK_REPORT_HISTORY.length}</Text>
              <Text style={styles.summarySublabel}>Academic records</Text>
            </View>
            <View style={styles.summaryRight}>
              <View style={styles.summaryStatRow}>
                <View style={styles.summaryStat}>
                  <Ionicons name="trending-up" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.summaryStatValue}>
                    {Math.round(
                      MOCK_REPORT_HISTORY.reduce((sum, r) => sum + r.totalPercentage, 0) /
                        MOCK_REPORT_HISTORY.length
                    )}%
                  </Text>
                  <Text style={styles.summaryStatLabel}>Avg Score</Text>
                </View>
                <View style={styles.summaryStatDivider} />
                <View style={styles.summaryStat}>
                  <Ionicons name="trophy" size={16} color="rgba(255,255,255,0.8)" />
                  <Text style={styles.summaryStatValue}>
                    #{Math.round(
                      MOCK_REPORT_HISTORY.reduce((sum, r) => sum + r.rank, 0) /
                        MOCK_REPORT_HISTORY.length
                    )}
                  </Text>
                  <Text style={styles.summaryStatLabel}>Avg Rank</Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>

      {/* Reports List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          isTablet && styles.scrollContentTablet,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {years.map((year) => (
          <View key={year} style={styles.yearSection}>
            <View style={styles.yearHeader}>
              <View style={[styles.yearBadge, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="calendar" size={14} color={colors.primary} />
                <Text style={[styles.yearText, { color: colors.primary }]}>{year}</Text>
              </View>
              <View style={[styles.yearLine, { backgroundColor: colors.border }]} />
            </View>

            <View style={[styles.reportsGrid, isTablet && styles.reportsGridTablet]}>
              {reportsByYear[year].map((report) => (
                <Pressable
                  key={report.id}
                  style={[
                    styles.reportCard,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                    isTablet && styles.reportCardTablet,
                  ]}
                  onPress={() => handleViewReport(report.id)}
                >
                  <View style={styles.reportCardHeader}>
                    <View>
                      <Text style={[styles.reportExamType, { color: colors.text }]}>
                        {report.examType}
                      </Text>
                      <Text style={[styles.reportTerm, { color: colors.textMuted }]}>
                        {report.term} {report.year}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.reportScoreBadge,
                        { backgroundColor: getScoreColor(report.totalPercentage) + '15' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.reportScoreText,
                          { color: getScoreColor(report.totalPercentage) },
                        ]}
                      >
                        {report.totalPercentage}%
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.reportCardDivider, { backgroundColor: colors.border }]} />

                  <View style={styles.reportCardStats}>
                    <View style={styles.reportStat}>
                      <Ionicons name="trophy-outline" size={14} color={colors.textMuted} />
                      <Text style={[styles.reportStatText, { color: colors.textSecondary }]}>
                        Rank #{report.rank} of {report.totalStudents}
                      </Text>
                    </View>
                    <View style={styles.reportStat}>
                      <Ionicons name="calendar-outline" size={14} color={colors.textMuted} />
                      <Text style={[styles.reportStatText, { color: colors.textSecondary }]}>
                        {formatDate(report.datePublished)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.reportCardFooter}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor:
                            report.status === 'pass' ? colors.successLight : colors.errorLight,
                        },
                      ]}
                    >
                      <Ionicons
                        name={report.status === 'pass' ? 'checkmark-circle' : 'close-circle'}
                        size={12}
                        color={report.status === 'pass' ? colors.success : colors.error}
                      />
                      <Text
                        style={[
                          styles.statusText,
                          { color: report.status === 'pass' ? colors.success : colors.error },
                        ]}
                      >
                        {report.status === 'pass' ? 'Passed' : 'Failed'}
                      </Text>
                    </View>
                    <View style={styles.viewButton}>
                      <Text style={[styles.viewButtonText, { color: colors.primary }]}>
                        View Details
                      </Text>
                      <Ionicons name="chevron-forward" size={14} color={colors.primary} />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  headerSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  summaryCard: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  summaryGradient: {
    padding: 16,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {},
  summaryLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: 'rgba(255,255,255,0.8)',
  },
  summaryValue: {
    fontSize: 36,
    fontFamily: FONTS.bold,
    color: '#ffffff',
    lineHeight: 42,
  },
  summarySublabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  summaryRight: {},
  summaryStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  summaryStat: {
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  summaryStatValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#ffffff',
    marginTop: 4,
  },
  summaryStatLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  summaryStatDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  scrollContentTablet: {
    paddingHorizontal: 24,
  },
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
    marginLeft: 12,
  },
  reportsGrid: {
    gap: 12,
  },
  reportsGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  reportCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  reportCardTablet: {
    width: (SCREEN_WIDTH - 48 - 16) / 2,
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  reportExamType: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  reportTerm: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  reportScoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reportScoreText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  reportCardDivider: {
    height: 1,
    marginVertical: 12,
  },
  reportCardStats: {
    gap: 8,
  },
  reportStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportStatText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  reportCardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewButtonText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
});
