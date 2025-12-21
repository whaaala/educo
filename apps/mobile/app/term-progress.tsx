import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

// Subject progress interface
interface SubjectProgress {
  name: string;
  testsCompleted: number;
  totalTests: number;
  currentAverage: number;
  lastTestScore: number | null;
  lastTestDate: string | null;
  status: 'completed' | 'in_progress' | 'pending';
}

// Mock subject progress data
const MOCK_SUBJECT_PROGRESS: SubjectProgress[] = [
  {
    name: 'Mathematics',
    testsCompleted: 3,
    totalTests: 4,
    currentAverage: 78,
    lastTestScore: 82,
    lastTestDate: '2025-02-10',
    status: 'in_progress',
  },
  {
    name: 'English Language',
    testsCompleted: 4,
    totalTests: 4,
    currentAverage: 72,
    lastTestScore: 75,
    lastTestDate: '2025-02-08',
    status: 'completed',
  },
  {
    name: 'Physics',
    testsCompleted: 2,
    totalTests: 4,
    currentAverage: 68,
    lastTestScore: 70,
    lastTestDate: '2025-02-05',
    status: 'in_progress',
  },
  {
    name: 'Chemistry',
    testsCompleted: 3,
    totalTests: 4,
    currentAverage: 74,
    lastTestScore: 76,
    lastTestDate: '2025-02-12',
    status: 'in_progress',
  },
  {
    name: 'Biology',
    testsCompleted: 0,
    totalTests: 4,
    currentAverage: 0,
    lastTestScore: null,
    lastTestDate: null,
    status: 'pending',
  },
  {
    name: 'Geography',
    testsCompleted: 1,
    totalTests: 3,
    currentAverage: 80,
    lastTestScore: 80,
    lastTestDate: '2025-01-28',
    status: 'in_progress',
  },
  {
    name: 'Civic Education',
    testsCompleted: 2,
    totalTests: 3,
    currentAverage: 85,
    lastTestScore: 88,
    lastTestDate: '2025-02-01',
    status: 'in_progress',
  },
];

function getScoreGradient(score: number): [string, string] {
  if (score >= 70) return ['#10b981', '#059669'];
  if (score >= 50) return ['#f59e0b', '#d97706'];
  return ['#ef4444', '#dc2626'];
}

function getStatusColor(status: SubjectProgress['status']): { bg: string; text: string } {
  switch (status) {
    case 'completed':
      return { bg: '#dcfce7', text: '#16a34a' };
    case 'in_progress':
      return { bg: '#fef3c7', text: '#d97706' };
    case 'pending':
      return { bg: '#f3f4f6', text: '#6b7280' };
  }
}

function getStatusLabel(status: SubjectProgress['status']): string {
  switch (status) {
    case 'completed':
      return 'Completed';
    case 'in_progress':
      return 'In Progress';
    case 'pending':
      return 'Pending';
  }
}

function formatDate(dateString: string | null): string {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
  });
}

export default function TermProgressScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isTablet = useIsTablet();

  const childName = (params.childName as string) || 'Student';
  const childClass = (params.childClass as string) || 'JSS 2';
  const term = (params.term as string) || 'Term 1';
  const year = (params.year as string) || '2025';
  const currentAverage = parseInt(params.totalPercentage as string) || 74;
  const currentPosition = parseInt(params.rank as string) || 8;
  const totalStudents = parseInt(params.totalStudents as string) || 42;
  const attendance = parseInt(params.attendance as string) || 92;
  const conduct = (params.conduct as string) || 'A';
  const lastUpdated = (params.datePublished as string) || new Date().toISOString();

  const childAvatar = 'https://i.pravatar.cc/150?u=adaeze';

  // Calculate overall progress
  const completedSubjects = MOCK_SUBJECT_PROGRESS.filter(s => s.status === 'completed').length;
  const totalSubjects = MOCK_SUBJECT_PROGRESS.length;
  const overallProgress = Math.round(
    (MOCK_SUBJECT_PROGRESS.reduce((sum, s) => sum + s.testsCompleted, 0) /
      MOCK_SUBJECT_PROGRESS.reduce((sum, s) => sum + s.totalTests, 0)) *
      100
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.background }]}>
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.backgroundTertiary }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Term Progress</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
        showsVerticalScrollIndicator={false}
      >
        {/* Student Info Card */}
        <View style={[styles.studentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.studentCardHeader}>
            <View style={styles.studentInfo}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.avatarRing}
              >
                <View style={[styles.avatarInner, { backgroundColor: colors.surface }]}>
                  <Image source={{ uri: childAvatar }} style={styles.avatar} />
                </View>
              </LinearGradient>
              <View style={styles.studentDetails}>
                <Text style={[styles.studentName, { color: colors.text }]}>{childName}</Text>
                <Text style={[styles.studentClass, { color: colors.textSecondary }]}>{childClass}</Text>
              </View>
            </View>
            <View style={styles.termBadgeContainer}>
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.termBadge}
              >
                <Ionicons name="pulse" size={12} color="#ffffff" />
                <Text style={styles.termBadgeText}>In Progress</Text>
              </LinearGradient>
              <Text style={[styles.termLabel, { color: colors.textSecondary }]}>
                {term} {year}
              </Text>
            </View>
          </View>
          <Text style={[styles.lastUpdated, { color: colors.textMuted }]}>
            Last updated: {formatDate(lastUpdated)}
          </Text>
        </View>

        {/* Overall Progress Stats - Tablet (4 in a row) */}
        {isTablet && (
          <View style={styles.tabletStatsCardsRow}>
            {/* Current Average Card */}
            <View style={[styles.tabletStatCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
              <View style={styles.tabletStatCardTop}>
                <Text style={[styles.tabletStatCardLabel, { color: '#059669' }]}>Current Avg</Text>
                <View style={[styles.tabletStatCardIcon, { backgroundColor: '#a7f3d0' }]}>
                  <Ionicons name="trending-up" size={16} color="#059669" />
                </View>
              </View>
              <Text style={[styles.tabletStatCardValue, { color: '#064e3b' }]}>{currentAverage}%</Text>
              <Text style={[styles.tabletStatCardSubtext, { color: '#047857' }]}>
                {completedSubjects}/{totalSubjects} subjects
              </Text>
            </View>

            {/* Position Card */}
            <View style={[styles.tabletStatCard, { backgroundColor: '#fef3c7', borderColor: '#fcd34d' }]}>
              <View style={styles.tabletStatCardTop}>
                <Text style={[styles.tabletStatCardLabel, { color: '#d97706' }]}>Position</Text>
                <View style={[styles.tabletStatCardIcon, { backgroundColor: '#fcd34d' }]}>
                  <Ionicons name="trophy" size={16} color="#d97706" />
                </View>
              </View>
              <Text style={[styles.tabletStatCardValue, { color: '#78350f' }]}>#{currentPosition}</Text>
              <Text style={[styles.tabletStatCardSubtext, { color: '#92400e' }]}>of {totalStudents}</Text>
            </View>

            {/* Attendance Card */}
            <View style={[styles.tabletStatCard, { backgroundColor: '#e0f2fe', borderColor: '#7dd3fc' }]}>
              <View style={styles.tabletStatCardTop}>
                <Text style={[styles.tabletStatCardLabel, { color: '#0284c7' }]}>Attendance</Text>
                <View style={[styles.tabletStatCardIcon, { backgroundColor: '#7dd3fc' }]}>
                  <Ionicons name="calendar-outline" size={16} color="#0284c7" />
                </View>
              </View>
              <Text style={[styles.tabletStatCardValue, { color: '#0c4a6e' }]}>{attendance}%</Text>
              <Text style={[styles.tabletStatCardSubtext, { color: '#0369a1' }]}>this term</Text>
            </View>

            {/* Conduct Card */}
            <View style={[styles.tabletStatCard, { backgroundColor: '#fce7f3', borderColor: '#f9a8d4' }]}>
              <View style={styles.tabletStatCardTop}>
                <Text style={[styles.tabletStatCardLabel, { color: '#db2777' }]}>Conduct</Text>
                <View style={[styles.tabletStatCardIcon, { backgroundColor: '#f9a8d4' }]}>
                  <Ionicons name="ribbon" size={16} color="#db2777" />
                </View>
              </View>
              <Text style={[styles.tabletStatCardValue, { color: '#831843' }]}>{conduct}</Text>
              <Text style={[styles.tabletStatCardSubtext, { color: '#9d174d' }]}>current grade</Text>
            </View>
          </View>
        )}

        {/* Overall Progress Stats - Mobile (2x2 grid) */}
        {!isTablet && (
          <View style={styles.mobileStatsGrid}>
            {/* Current Average Card */}
            <View style={[styles.mobileStatCard, { backgroundColor: '#f0fdf4' }]}>
              <View style={styles.mobileStatCardTop}>
                <Text style={[styles.mobileStatCardLabel, { color: '#16a34a' }]}>Current Avg</Text>
                <View style={[styles.mobileStatCardIcon, { backgroundColor: '#dcfce7' }]}>
                  <Ionicons name="analytics" size={14} color="#16a34a" />
                </View>
              </View>
              <Text style={[styles.mobileStatCardValue, { color: '#14532d' }]}>{currentAverage}%</Text>
              <Text style={[styles.mobileStatCardSubtext, { color: '#166534' }]}>
                {completedSubjects}/{totalSubjects} subjects
              </Text>
            </View>

            {/* Position Card */}
            <View style={[styles.mobileStatCard, { backgroundColor: '#fefce8' }]}>
              <View style={styles.mobileStatCardTop}>
                <Text style={[styles.mobileStatCardLabel, { color: '#ca8a04' }]}>Position</Text>
                <View style={[styles.mobileStatCardIcon, { backgroundColor: '#fef9c3' }]}>
                  <Ionicons name="trophy" size={14} color="#ca8a04" />
                </View>
              </View>
              <Text style={[styles.mobileStatCardValue, { color: '#713f12' }]}>#{currentPosition}</Text>
              <Text style={[styles.mobileStatCardSubtext, { color: '#854d0e' }]}>of {totalStudents}</Text>
            </View>

            {/* Attendance Card */}
            <View style={[styles.mobileStatCard, { backgroundColor: '#eef2ff' }]}>
              <View style={styles.mobileStatCardTop}>
                <Text style={[styles.mobileStatCardLabel, { color: '#6366f1' }]}>Attendance</Text>
                <View style={[styles.mobileStatCardIcon, { backgroundColor: '#e0e7ff' }]}>
                  <Ionicons name="calendar-outline" size={14} color="#6366f1" />
                </View>
              </View>
              <Text style={[styles.mobileStatCardValue, { color: '#1e1b4b' }]}>{attendance}%</Text>
              <Text style={[styles.mobileStatCardSubtext, { color: '#4338ca' }]}>this term</Text>
            </View>

            {/* Conduct Card */}
            <View style={[styles.mobileStatCard, { backgroundColor: '#fdf2f8' }]}>
              <View style={styles.mobileStatCardTop}>
                <Text style={[styles.mobileStatCardLabel, { color: '#db2777' }]}>Conduct</Text>
                <View style={[styles.mobileStatCardIcon, { backgroundColor: '#fce7f3' }]}>
                  <Ionicons name="ribbon" size={14} color="#db2777" />
                </View>
              </View>
              <Text style={[styles.mobileStatCardValue, { color: '#831843' }]}>{conduct}</Text>
              <Text style={[styles.mobileStatCardSubtext, { color: '#9d174d' }]}>current grade</Text>
            </View>
          </View>
        )}

        {/* Progress Bar */}
        <View style={[styles.progressContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.progressHeader}>
            <Text style={[styles.progressLabel, { color: colors.text }]}>Term Completion</Text>
            <Text style={[styles.progressValue, { color: colors.primary }]}>{overallProgress}%</Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.backgroundTertiary }]}>
            <LinearGradient
              colors={['#6366f1', '#8b5cf6']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${overallProgress}%` }]}
            />
          </View>
          <Text style={[styles.progressSubtext, { color: colors.textMuted }]}>
            {completedSubjects} of {totalSubjects} subjects completed
          </Text>
        </View>

        {/* Subject Progress Header */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Subject Progress</Text>
          <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>
            {totalSubjects} subjects
          </Text>
        </View>

        {/* Subject Cards */}
        <View style={[styles.subjectsContainer, isTablet && styles.subjectsContainerTablet]}>
          {MOCK_SUBJECT_PROGRESS.map((subject) => {
            const statusColors = getStatusColor(subject.status);
            const progressPercent = subject.totalTests > 0
              ? Math.round((subject.testsCompleted / subject.totalTests) * 100)
              : 0;
            const scoreGradient = subject.currentAverage > 0
              ? getScoreGradient(subject.currentAverage)
              : ['#9ca3af', '#6b7280'];

            return (
              <View
                key={subject.name}
                style={[
                  styles.subjectCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  isTablet && styles.subjectCardTablet,
                ]}
              >
                {/* Card Header */}
                <View style={styles.subjectCardHeader}>
                  <View style={styles.subjectCardHeaderLeft}>
                    <View style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}>
                      <Text style={[styles.statusText, { color: statusColors.text }]}>
                        {getStatusLabel(subject.status)}
                      </Text>
                    </View>
                    <Text style={[styles.subjectName, { color: colors.text }]}>{subject.name}</Text>
                  </View>
                  {/* Score Circle */}
                  <LinearGradient
                    colors={scoreGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.scoreCircle}
                  >
                    <Text style={styles.scoreCircleText}>
                      {subject.currentAverage > 0 ? `${subject.currentAverage}%` : '-'}
                    </Text>
                  </LinearGradient>
                </View>

                {/* Subject Stats Cards - 2x2 Grid */}
                <View style={[styles.subjectStatsGrid, { backgroundColor: colors.backgroundSecondary }]}>
                  {/* Average Card */}
                  <View style={[styles.subjectStatCard, { backgroundColor: '#f0fdf4' }]}>
                    <View style={styles.subjectStatCardTop}>
                      <Text style={[styles.subjectStatCardLabel, { color: '#16a34a' }]}>Average</Text>
                      <View style={[styles.subjectStatCardIcon, { backgroundColor: '#dcfce7' }]}>
                        <Ionicons name="analytics" size={isTablet ? 12 : 10} color="#16a34a" />
                      </View>
                    </View>
                    <Text style={[styles.subjectStatCardValue, { color: '#14532d' }]}>
                      {subject.currentAverage > 0 ? `${subject.currentAverage}%` : '-'}
                    </Text>
                  </View>

                  {/* Tests Card */}
                  <View style={[styles.subjectStatCard, { backgroundColor: '#fefce8' }]}>
                    <View style={styles.subjectStatCardTop}>
                      <Text style={[styles.subjectStatCardLabel, { color: '#ca8a04' }]}>Tests</Text>
                      <View style={[styles.subjectStatCardIcon, { backgroundColor: '#fef9c3' }]}>
                        <Ionicons name="document-text" size={isTablet ? 12 : 10} color="#ca8a04" />
                      </View>
                    </View>
                    <Text style={[styles.subjectStatCardValue, { color: '#713f12' }]}>
                      {subject.testsCompleted}/{subject.totalTests}
                    </Text>
                    <Text style={[styles.subjectStatCardSubtext, { color: '#854d0e' }]}>completed</Text>
                  </View>

                  {/* Last Score Card */}
                  <View style={[styles.subjectStatCard, { backgroundColor: '#eef2ff' }]}>
                    <View style={styles.subjectStatCardTop}>
                      <Text style={[styles.subjectStatCardLabel, { color: '#6366f1' }]}>Last Test</Text>
                      <View style={[styles.subjectStatCardIcon, { backgroundColor: '#e0e7ff' }]}>
                        <Ionicons name="checkmark-circle" size={isTablet ? 12 : 10} color="#6366f1" />
                      </View>
                    </View>
                    <Text style={[styles.subjectStatCardValue, { color: '#1e1b4b' }]}>
                      {subject.lastTestScore ? `${subject.lastTestScore}%` : '-'}
                    </Text>
                  </View>

                  {/* Date Card */}
                  <View style={[styles.subjectStatCard, { backgroundColor: '#fdf2f8' }]}>
                    <View style={styles.subjectStatCardTop}>
                      <Text style={[styles.subjectStatCardLabel, { color: '#db2777' }]}>Date</Text>
                      <View style={[styles.subjectStatCardIcon, { backgroundColor: '#fce7f3' }]}>
                        <Ionicons name="calendar" size={isTablet ? 12 : 10} color="#db2777" />
                      </View>
                    </View>
                    <Text style={[styles.subjectStatCardValue, { color: '#831843' }]}>
                      {formatDate(subject.lastTestDate)}
                    </Text>
                  </View>
                </View>

                {/* Progress Info Row */}
                <View style={[styles.subjectInfoRow, { backgroundColor: colors.surface }]}>
                  <View style={styles.subjectInfoItem}>
                    <Ionicons name="pie-chart-outline" size={14} color={colors.textMuted} />
                    <Text style={[styles.subjectInfoValue, { color: colors.text }]}>
                      {progressPercent}%
                    </Text>
                    <Text style={[styles.subjectInfoLabel, { color: colors.textMuted }]}>
                      complete
                    </Text>
                  </View>
                  <View style={[styles.subjectInfoDivider, { backgroundColor: colors.border }]} />
                  <View style={[styles.subjectProgressBarContainer]}>
                    <View style={[styles.subjectProgressBar, { backgroundColor: colors.backgroundTertiary }]}>
                      <View
                        style={[
                          styles.subjectProgressFill,
                          {
                            width: `${progressPercent}%`,
                            backgroundColor: subject.status === 'completed' ? '#10b981' : '#6366f1',
                          },
                        ]}
                      />
                    </View>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Note about report generation */}
        <View style={[styles.noteContainer, { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }]}>
          <Ionicons name="information-circle" size={20} color="#6366f1" />
          <Text style={[styles.noteText, { color: '#4338ca' }]}>
            The final report card will be generated at the end of the term once all assessments are completed.
          </Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  scrollContentTablet: {
    paddingHorizontal: 24,
  },
  // Student Card
  studentCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  studentCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 25,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 23,
  },
  studentDetails: {
    marginLeft: 12,
  },
  studentName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  studentClass: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  termBadgeContainer: {
    alignItems: 'flex-end',
  },
  termBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  termBadgeText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
  termLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 6,
  },
  lastUpdated: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 12,
  },
  // Tablet Stats Cards Row
  tabletStatsCardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  tabletStatCard: {
    flex: 1,
    paddingVertical: 16,
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
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  tabletStatCardIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabletStatCardValue: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  tabletStatCardSubtext: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  // Mobile Stats Grid
  mobileStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  mobileStatCard: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  mobileStatCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  mobileStatCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  mobileStatCardIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mobileStatCardValue: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  mobileStatCardSubtext: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  // Progress Container
  progressContainer: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
  },
  progressValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  progressBar: {
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressSubtext: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 8,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  sectionSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  // Subjects Container
  subjectsContainer: {
    gap: 12,
  },
  subjectsContainerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  subjectCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  subjectCardTablet: {
    width: (SCREEN_WIDTH - 48 - 12) / 2,
  },
  subjectCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 14,
  },
  subjectCardHeaderLeft: {
    flex: 1,
    gap: 6,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },
  subjectName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  scoreCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreCircleText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: '#ffffff',
  },
  // Subject Stats Grid
  subjectStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 12,
  },
  subjectStatCard: {
    width: '48%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  subjectStatCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subjectStatCardLabel: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  subjectStatCardIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectStatCardValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    letterSpacing: -0.3,
  },
  subjectStatCardSubtext: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  // Subject Info Row
  subjectInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  subjectInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  subjectInfoValue: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  subjectInfoLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  subjectInfoDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 12,
  },
  subjectProgressBarContainer: {
    flex: 1,
  },
  subjectProgressBar: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjectProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  // Note Container
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    fontFamily: FONTS.medium,
    lineHeight: 18,
  },
});
