import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';
import { Modal } from '../ui/Modal';

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
  results?: ExamResult[];
}

// Mock results data
const MOCK_RESULTS: ExamResult[] = [
  {
    id: 'result-001',
    examType: 'Mid-Term Exam',
    term: 'Term 2',
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
    examType: 'First Term Exam',
    term: 'Term 1',
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
];

export function ViewResultsModal({
  visible,
  onClose,
  childName,
  childClass,
  results = MOCK_RESULTS,
}: ViewResultsModalProps) {
  const { colors } = useTheme();
  const [selectedResult, setSelectedResult] = useState<string | null>(
    results.length > 0 ? results[0].id : null
  );

  const currentResult = results.find((r) => r.id === selectedResult);

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

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Exam Results"
      subtitle={childName ? `${childName}${childClass ? ` (${childClass})` : ''}` : 'View academic performance'}
      icon={<Ionicons name="school" size={22} color="#ffffff" />}
      iconBgColors={['#6366f1', '#4f46e5']}
    >
      <View style={styles.content}>
        {/* Exam Selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.examSelector}
          contentContainerStyle={styles.examSelectorContent}
        >
          {results.map((result) => (
            <Pressable
              key={result.id}
              style={[
                styles.examTab,
                { backgroundColor: colors.backgroundTertiary, borderColor: colors.border },
                selectedResult === result.id && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
              ]}
              onPress={() => setSelectedResult(result.id)}
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
            <Pressable style={styles.fullReportLink}>
              <Ionicons name="document-text-outline" size={16} color={colors.primary} />
              <Text style={[styles.fullReportText, { color: colors.primary }]}>View Full Report Card</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.primary} />
            </Pressable>
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
});

export default ViewResultsModal;
