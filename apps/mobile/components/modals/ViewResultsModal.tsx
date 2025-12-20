import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../ui/Modal';

const TAB_WIDTH = 140; // Approximate width of each tab
const TAB_GAP = 10;

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

interface SubjectResult {
  id: string;
  subject: string;
  score: number;
  maxScore: number;
  grade: string;
  teacher: string;
}

interface ExamResult {
  id: string;
  examType: string;
  term: string;
  year: string;
  totalPercentage: number;
  rank: number;
  totalStudents: number;
  status: 'pass' | 'fail';
  subjects: SubjectResult[];
}

export interface ViewResultsModalProps {
  visible: boolean;
  onClose: () => void;
  childName?: string;
  childClass?: string;
  childId?: string;
  results?: ExamResult[];
  onViewAllReports?: (childId?: string) => void;
}

// Mock results data
const MOCK_RESULTS: ExamResult[] = [
  {
    id: 'result-001',
    examType: 'Third Term Exam',
    term: 'Term 3',
    year: '2024',
    totalPercentage: 78,
    rank: 5,
    totalStudents: 45,
    status: 'pass',
    subjects: [
      { id: 's1', subject: 'Mathematics', score: 85, maxScore: 100, grade: 'A', teacher: 'Mrs. Eze' },
      { id: 's2', subject: 'English Language', score: 72, maxScore: 100, grade: 'B', teacher: 'Mr. Okoro' },
      { id: 's3', subject: 'Basic Science', score: 80, maxScore: 100, grade: 'A', teacher: 'Mrs. Adeyemi' },
      { id: 's4', subject: 'Social Studies', score: 68, maxScore: 100, grade: 'B', teacher: 'Mr. Nwosu' },
      { id: 's5', subject: 'Computer Studies', score: 90, maxScore: 100, grade: 'A', teacher: 'Ms. Uche' },
    ],
  },
  {
    id: 'result-002',
    examType: 'Second Term Exam',
    term: 'Term 2',
    year: '2024',
    totalPercentage: 82,
    rank: 3,
    totalStudents: 45,
    status: 'pass',
    subjects: [
      { id: 's1', subject: 'Mathematics', score: 88, maxScore: 100, grade: 'A', teacher: 'Mrs. Eze' },
      { id: 's2', subject: 'English Language', score: 75, maxScore: 100, grade: 'B', teacher: 'Mr. Okoro' },
      { id: 's3', subject: 'Basic Science', score: 82, maxScore: 100, grade: 'A', teacher: 'Mrs. Adeyemi' },
      { id: 's4', subject: 'Social Studies', score: 80, maxScore: 100, grade: 'A', teacher: 'Mr. Nwosu' },
      { id: 's5', subject: 'Computer Studies', score: 85, maxScore: 100, grade: 'A', teacher: 'Ms. Uche' },
    ],
  },
  {
    id: 'result-003',
    examType: 'First Term Exam',
    term: 'Term 1',
    year: '2024',
    totalPercentage: 75,
    rank: 7,
    totalStudents: 45,
    status: 'pass',
    subjects: [
      { id: 's1', subject: 'Mathematics', score: 78, maxScore: 100, grade: 'B', teacher: 'Mrs. Eze' },
      { id: 's2', subject: 'English Language', score: 70, maxScore: 100, grade: 'B', teacher: 'Mr. Okoro' },
      { id: 's3', subject: 'Basic Science', score: 76, maxScore: 100, grade: 'B', teacher: 'Mrs. Adeyemi' },
      { id: 's4', subject: 'Social Studies', score: 74, maxScore: 100, grade: 'B', teacher: 'Mr. Nwosu' },
      { id: 's5', subject: 'Computer Studies', score: 80, maxScore: 100, grade: 'A', teacher: 'Ms. Uche' },
    ],
  },
];

export function ViewResultsModal({
  visible,
  onClose,
  childName,
  childClass,
  childId,
  results = MOCK_RESULTS,
  onViewAllReports,
}: ViewResultsModalProps) {
  const { colors } = useTheme();
  const [selectedResult, setSelectedResult] = useState<string | null>(
    results.length > 0 ? results[0].id : null
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);
  const examSelectorRef = useRef<ScrollViewType>(null);

  const currentResult = results.find((r) => r.id === selectedResult);

  // Scroll to selected tab when it changes
  const scrollToSelectedTab = (index: number) => {
    if (examSelectorRef.current) {
      const scrollPosition = Math.max(0, index * (TAB_WIDTH + TAB_GAP) - 20);
      examSelectorRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  // Handle tab selection
  const handleTabSelect = (resultId: string, index: number) => {
    setSelectedResult(resultId);
    scrollToSelectedTab(index);
  };

  // Scroll to initial selected tab when modal opens
  useEffect(() => {
    if (visible && selectedResult) {
      const index = results.findIndex((r) => r.id === selectedResult);
      if (index > 0) {
        setTimeout(() => scrollToSelectedTab(index), 100);
      }
    }
  }, [visible]);

  // Generate report content as text
  const generateReportContent = (result: ExamResult) => {
    const lines: string[] = [];
    lines.push('═══════════════════════════════════════════');
    lines.push('           STUDENT REPORT CARD');
    lines.push('═══════════════════════════════════════════');
    lines.push('');
    lines.push(`Student: ${childName || 'N/A'}`);
    lines.push(`Class: ${childClass || 'N/A'}`);
    lines.push(`Exam: ${result.examType}`);
    lines.push(`Term: ${result.term} ${result.year}`);
    lines.push('');
    lines.push('───────────────────────────────────────────');
    lines.push('                SUMMARY');
    lines.push('───────────────────────────────────────────');
    lines.push(`Overall Score: ${result.totalPercentage}%`);
    lines.push(`Class Rank: #${result.rank} of ${result.totalStudents}`);
    lines.push(`Status: ${result.status === 'pass' ? 'PASSED' : 'FAILED'}`);
    lines.push('');
    lines.push('───────────────────────────────────────────');
    lines.push('           SUBJECT BREAKDOWN');
    lines.push('───────────────────────────────────────────');
    lines.push('');

    result.subjects.forEach((subject) => {
      lines.push(`${subject.subject}`);
      lines.push(`  Score: ${subject.score}/${subject.maxScore} (${subject.grade})`);
      lines.push(`  Teacher: ${subject.teacher}`);
      lines.push('');
    });

    lines.push('═══════════════════════════════════════════');
    lines.push(`Generated on: ${new Date().toLocaleDateString()}`);
    lines.push('═══════════════════════════════════════════');

    return lines.join('\n');
  };

  // Handle download/share
  const handleDownloadReport = async () => {
    if (!currentResult) return;

    setIsDownloading(true);

    try {
      const reportContent = generateReportContent(currentResult);
      const title = `${childName || 'Student'} - ${currentResult.examType} Report`;

      await Share.share({
        message: reportContent,
        title: title,
      });
    } catch (error) {
      if ((error as Error).message !== 'User did not share') {
        console.error('Error sharing report:', error);
        Alert.alert(
          'Error',
          'Failed to share report. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsDownloading(false);
    }
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A':
        return colors.success;
      case 'B':
        return colors.primary;
      case 'C':
        return colors.warning;
      case 'D':
        return '#f97316'; // Orange
      default:
        return colors.error;
    }
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 70) return colors.success;
    if (percentage >= 50) return colors.warning;
    return colors.error;
  };

  const getScoreGradient = (percentage: number): readonly [string, string] => {
    if (percentage >= 70) return ['#10b981', '#059669'] as const;
    if (percentage >= 50) return ['#f59e0b', '#d97706'] as const;
    return ['#ef4444', '#dc2626'] as const;
  };

  const footer = showFullReport ? (
    <View style={styles.footer}>
      <Pressable
        style={[styles.footerButtonClose, { backgroundColor: colors.backgroundTertiary }]}
        onPress={() => setShowFullReport(false)}
      >
        <View style={[styles.footerButtonIconWrap, { backgroundColor: colors.border }]}>
          <Ionicons name="arrow-back" size={14} color={colors.textSecondary} />
        </View>
        <Text style={[styles.footerButtonCloseText, { color: colors.textSecondary }]}>Back</Text>
      </Pressable>
      <Pressable
        style={[
          styles.footerButtonPrimary,
          { backgroundColor: '#6366f1' },
          isDownloading && { opacity: 0.7 },
        ]}
        onPress={handleDownloadReport}
        disabled={isDownloading || !currentResult}
      >
        <Ionicons name={isDownloading ? 'hourglass-outline' : 'share-outline'} size={16} color="#ffffff" />
        <Text style={styles.footerButtonPrimaryText}>
          {isDownloading ? 'Sharing...' : 'Share Report'}
        </Text>
      </Pressable>
    </View>
  ) : (
    <View style={styles.footer}>
      <Pressable
        style={[styles.footerButtonClose, { backgroundColor: colors.backgroundTertiary }]}
        onPress={onClose}
      >
        <Text style={[styles.footerButtonCloseText, { color: colors.textSecondary }]}>Close</Text>
      </Pressable>
      <Pressable
        style={[
          styles.footerButtonPrimary,
          { backgroundColor: '#6366f1' },
          isDownloading && { opacity: 0.7 },
        ]}
        onPress={handleDownloadReport}
        disabled={isDownloading || !currentResult}
      >
        <Ionicons name={isDownloading ? 'hourglass-outline' : 'download-outline'} size={16} color="#ffffff" />
        <Text style={styles.footerButtonPrimaryText}>
          {isDownloading ? 'Generating...' : 'Download'}
        </Text>
      </Pressable>
    </View>
  );

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Exam Results"
      subtitle={childName ? `${childName}${childClass ? ` (${childClass})` : ''}` : 'View academic performance'}
      icon={<Ionicons name="school" size={22} color="#ffffff" />}
      iconBgColors={['#6366f1', '#4f46e5']}
      footer={footer}
    >
      <View style={styles.content}>
        {showFullReport && currentResult ? (
          /* Full Report View */
          <View style={styles.fullReportContainer}>
            {/* Report Header */}
            <View style={[styles.reportHeader, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.reportSchoolInfo}>
                <View style={[styles.reportSchoolIcon, { backgroundColor: colors.primary }]}>
                  <Ionicons name="school" size={20} color="#ffffff" />
                </View>
                <View>
                  <Text style={[styles.reportSchoolName, { color: colors.text }]}>Educo Demo School</Text>
                  <Text style={[styles.reportSchoolAddress, { color: colors.textMuted }]}>Lagos, Nigeria</Text>
                </View>
              </View>
              <Text style={[styles.reportTitle, { color: colors.text }]}>STUDENT REPORT CARD</Text>
              <View style={[styles.reportDivider, { backgroundColor: colors.border }]} />
              <View style={styles.reportStudentInfo}>
                <View style={styles.reportInfoRow}>
                  <Text style={[styles.reportInfoLabel, { color: colors.textMuted }]}>Student:</Text>
                  <Text style={[styles.reportInfoValue, { color: colors.text }]}>{childName || 'N/A'}</Text>
                </View>
                <View style={styles.reportInfoRow}>
                  <Text style={[styles.reportInfoLabel, { color: colors.textMuted }]}>Class:</Text>
                  <Text style={[styles.reportInfoValue, { color: colors.text }]}>{childClass || 'N/A'}</Text>
                </View>
                <View style={styles.reportInfoRow}>
                  <Text style={[styles.reportInfoLabel, { color: colors.textMuted }]}>Exam:</Text>
                  <Text style={[styles.reportInfoValue, { color: colors.text }]}>{currentResult.examType}</Text>
                </View>
                <View style={styles.reportInfoRow}>
                  <Text style={[styles.reportInfoLabel, { color: colors.textMuted }]}>Term:</Text>
                  <Text style={[styles.reportInfoValue, { color: colors.text }]}>{currentResult.term} {currentResult.year}</Text>
                </View>
              </View>
            </View>

            {/* Summary Section */}
            <View style={[styles.reportSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.reportSectionTitle, { color: colors.text }]}>Performance Summary</Text>
              <View style={styles.reportSummaryGrid}>
                <View style={[styles.reportSummaryItem, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={[styles.reportSummaryValue, { color: colors.primary }]}>{currentResult.totalPercentage}%</Text>
                  <Text style={[styles.reportSummaryLabel, { color: colors.textMuted }]}>Overall Score</Text>
                </View>
                <View style={[styles.reportSummaryItem, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={[styles.reportSummaryValue, { color: colors.success }]}>#{currentResult.rank}</Text>
                  <Text style={[styles.reportSummaryLabel, { color: colors.textMuted }]}>Class Position</Text>
                </View>
                <View style={[styles.reportSummaryItem, { backgroundColor: colors.backgroundTertiary }]}>
                  <Text style={[styles.reportSummaryValue, { color: colors.text }]}>{currentResult.totalStudents}</Text>
                  <Text style={[styles.reportSummaryLabel, { color: colors.textMuted }]}>Total Students</Text>
                </View>
                <View style={[styles.reportSummaryItem, { backgroundColor: currentResult.status === 'pass' ? colors.successLight : colors.errorLight }]}>
                  <Text style={[styles.reportSummaryValue, { color: currentResult.status === 'pass' ? colors.success : colors.error }]}>
                    {currentResult.status === 'pass' ? 'PASS' : 'FAIL'}
                  </Text>
                  <Text style={[styles.reportSummaryLabel, { color: colors.textMuted }]}>Status</Text>
                </View>
              </View>
            </View>

            {/* Subject Scores Table */}
            <View style={[styles.reportSection, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.reportSectionTitle, { color: colors.text }]}>Subject Scores</Text>

              {/* Table Header */}
              <View style={[styles.reportTableHeader, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
                <Text style={[styles.reportTableHeaderText, styles.reportTableSubject, { color: colors.textSecondary }]}>Subject</Text>
                <Text style={[styles.reportTableHeaderText, styles.reportTableScore, { color: colors.textSecondary }]}>Score</Text>
                <Text style={[styles.reportTableHeaderText, styles.reportTableGrade, { color: colors.textSecondary }]}>Grade</Text>
              </View>

              {/* Table Rows */}
              {currentResult.subjects.map((subject, index) => (
                <View
                  key={subject.id}
                  style={[
                    styles.reportTableRow,
                    { borderColor: colors.border },
                    index % 2 === 0 && { backgroundColor: colors.backgroundSecondary },
                  ]}
                >
                  <View style={styles.reportTableSubject}>
                    <Text style={[styles.reportTableCell, { color: colors.text }]}>{subject.subject}</Text>
                    <Text style={[styles.reportTableCellSub, { color: colors.textMuted }]}>{subject.teacher}</Text>
                  </View>
                  <Text style={[styles.reportTableCell, styles.reportTableScore, { color: colors.text }]}>
                    {subject.score}/{subject.maxScore}
                  </Text>
                  <View style={[styles.reportTableGrade, styles.reportGradeBadge, { backgroundColor: getGradeColor(subject.grade) + '20' }]}>
                    <Text style={[styles.reportGradeText, { color: getGradeColor(subject.grade) }]}>{subject.grade}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Footer Note */}
            <View style={styles.reportFooterNote}>
              <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
              <Text style={[styles.reportFooterNoteText, { color: colors.textMuted }]}>
                Generated on {new Date().toLocaleDateString()}
              </Text>
            </View>
          </View>
        ) : (
          <>
            {/* Exam Selector */}
            <ScrollView
              ref={examSelectorRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.examSelector}
              contentContainerStyle={styles.examSelectorContent}
            >
              {results.map((result, index) => (
                <Pressable
                  key={result.id}
                  style={[
                    styles.examTab,
                    { backgroundColor: colors.backgroundTertiary, borderColor: colors.border },
                    selectedResult === result.id && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
                  ]}
                  onPress={() => handleTabSelect(result.id, index)}
                >
                  <Text
                    style={[
                      styles.examTabText,
                      { color: colors.textSecondary },
                      selectedResult === result.id && { color: colors.primary },
                    ]}
                  >
                    {result.examType}
                  </Text>
                  <Text
                    style={[
                      styles.examTabSubtext,
                      { color: colors.textMuted },
                      selectedResult === result.id && { color: colors.primary },
                    ]}
                  >
                    {result.term} {result.year}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {currentResult && (
              <>
                {/* Overall Performance Card */}
                <LinearGradient
                  colors={getScoreGradient(currentResult.totalPercentage)}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.performanceCard}
                >
                  <View style={styles.performanceRow}>
                    <View style={styles.performanceMain}>
                      <Text style={styles.performanceLabel}>Overall Score</Text>
                      <Text style={styles.performanceScore}>{currentResult.totalPercentage}%</Text>
                      <View style={[styles.statusBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Ionicons
                          name={currentResult.status === 'pass' ? 'checkmark-circle' : 'close-circle'}
                          size={12}
                          color="#ffffff"
                        />
                        <Text style={styles.statusBadgeText}>
                          {currentResult.status === 'pass' ? 'Passed' : 'Failed'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.performanceStats}>
                      <View style={styles.statItem}>
                        <Ionicons name="trophy" size={16} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.statValue}>#{currentResult.rank}</Text>
                        <Text style={styles.statLabel}>Rank</Text>
                      </View>
                      <View style={styles.statDivider} />
                      <View style={styles.statItem}>
                        <Ionicons name="people" size={16} color="rgba(255,255,255,0.8)" />
                        <Text style={styles.statValue}>{currentResult.totalStudents}</Text>
                        <Text style={styles.statLabel}>Students</Text>
                      </View>
                    </View>
                  </View>
                </LinearGradient>

                {/* Subject Results */}
                <View style={styles.subjectsSection}>
                  <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Subject Breakdown</Text>

                  {currentResult.subjects.map((subject) => {
                    const percentage = (subject.score / subject.maxScore) * 100;

                    return (
                      <View
                        key={subject.id}
                        style={[styles.subjectItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
                      >
                        <View style={styles.subjectHeader}>
                          <View style={styles.subjectInfo}>
                            <Text style={[styles.subjectName, { color: colors.text }]}>{subject.subject}</Text>
                            <Text style={[styles.teacherName, { color: colors.textMuted }]}>{subject.teacher}</Text>
                          </View>
                          <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(subject.grade) + '20' }]}>
                            <Text style={[styles.gradeText, { color: getGradeColor(subject.grade) }]}>
                              {subject.grade}
                            </Text>
                          </View>
                        </View>

                        <View style={styles.scoreRow}>
                          <View style={[styles.progressBar, { backgroundColor: colors.backgroundTertiary }]}>
                            <View
                              style={[
                                styles.progressFill,
                                { width: `${percentage}%`, backgroundColor: getScoreColor(percentage) },
                              ]}
                            />
                          </View>
                          <Text style={[styles.scoreText, { color: colors.text }]}>
                            {subject.score}/{subject.maxScore}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* View Full Report Link */}
                <Pressable style={styles.fullReportLink} onPress={() => setShowFullReport(true)}>
                  <Ionicons name="document-text-outline" size={16} color={colors.primary} />
                  <Text style={[styles.fullReportText, { color: colors.primary }]}>View Full Report Card</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </Pressable>

                {/* View All Reports History Link */}
                {onViewAllReports && (
                  <Pressable
                    style={[styles.viewAllReportsLink, { borderTopColor: colors.border }]}
                    onPress={() => {
                      onClose();
                      onViewAllReports(childId);
                    }}
                  >
                    <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                    <Text style={[styles.viewAllReportsText, { color: colors.textSecondary }]}>View Reports History</Text>
                    <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
                  </Pressable>
                )}
              </>
            )}

            {!currentResult && (
              <View style={styles.emptyState}>
                <Ionicons name="school-outline" size={48} color={colors.textMuted} />
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No Results Available</Text>
                <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                  Exam results will appear here once they are published.
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
  },
  examSelector: {
    marginHorizontal: -20,
    marginTop: -4,
  },
  examSelectorContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  examTab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    minWidth: 120,
  },
  examTabText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  examTabSubtext: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  performanceCard: {
    borderRadius: 16,
    padding: 16,
    marginTop: 4,
  },
  performanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceMain: {},
  performanceLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 4,
  },
  performanceScore: {
    fontSize: 42,
    fontFamily: FONTS.bold,
    color: '#ffffff',
    lineHeight: 48,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginTop: 8,
    alignSelf: 'flex-start',
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
  performanceStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  statItem: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  statValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#ffffff',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  subjectsSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  subjectItem: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectInfo: {
    flex: 1,
  },
  subjectName: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
  teacherName: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  gradeBadge: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  progressBar: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  scoreText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    minWidth: 50,
    textAlign: 'right',
  },
  fullReportLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    gap: 6,
    marginTop: 4,
  },
  fullReportText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  viewAllReportsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 6,
    marginTop: 8,
    borderTopWidth: 1,
  },
  viewAllReportsText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    marginTop: 12,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerButtonClose: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    gap: 8,
  },
  footerButtonCloseText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  footerButtonIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 6,
  },
  footerButtonIconWrapSecondary: {
    width: 24,
    height: 24,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerButtonSecondaryText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  footerButtonPrimary: {
    paddingHorizontal: 24,
    height: 48,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerButtonGradient: {
    width: '100%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  footerButtonPrimaryText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
  // Full Report View Styles
  fullReportContainer: {
    gap: 16,
  },
  reportHeader: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  reportSchoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  reportSchoolIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportSchoolName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  reportSchoolAddress: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  reportTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    letterSpacing: 1,
    marginVertical: 8,
  },
  reportDivider: {
    height: 1,
    marginVertical: 12,
  },
  reportStudentInfo: {
    gap: 8,
  },
  reportInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportInfoLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  reportInfoValue: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  reportSection: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
  },
  reportSectionTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  reportSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  reportSummaryItem: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
  },
  reportSummaryValue: {
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  reportSummaryLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 4,
  },
  reportTableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 4,
  },
  reportTableHeaderText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
  },
  reportTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
  },
  reportTableSubject: {
    flex: 1,
  },
  reportTableScore: {
    width: 70,
    textAlign: 'center',
  },
  reportTableGrade: {
    width: 40,
    alignItems: 'center',
  },
  reportTableCell: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  reportTableCellSub: {
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginTop: 2,
  },
  reportGradeBadge: {
    width: 32,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportGradeText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  reportFooterNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  reportFooterNoteText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
});

export default ViewResultsModal;
