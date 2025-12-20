import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  Share,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
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

// Subject result interface
interface SubjectResult {
  name: string;
  score: number;
  grade: string;
  classAverage: number;
  position: number;
  totalStudents: number;
  teacherRemark?: string;
}

// Helper to get grade from score
function getGradeFromScore(score: number): string {
  if (score >= 70) return 'A';
  if (score >= 60) return 'B';
  if (score >= 50) return 'C';
  if (score >= 40) return 'D';
  return 'F';
}

// Generate subject data based on report parameters
function generateSubjectsForReport(
  reportId: string,
  totalPercentage: number,
  subjectCount: number,
  totalStudents: number
): SubjectResult[] {
  // Base subjects (8 subjects for newer reports, 7 for older)
  const allSubjects = [
    'Mathematics',
    'English Language',
    'Physics',
    'Chemistry',
    'Biology',
    'Geography',
    'History',
    'Civic Education',
  ];

  const subjects = allSubjects.slice(0, subjectCount);

  // Generate scores that roughly average to the total percentage
  // Use reportId to create variation
  const seed = reportId.charCodeAt(reportId.length - 1);

  return subjects.map((name, index) => {
    // Create variation around the average
    const variation = ((seed + index * 7) % 20) - 10;
    let score = Math.min(100, Math.max(20, totalPercentage + variation));

    // Adjust based on subject difficulty patterns
    if (name === 'Mathematics' && totalPercentage >= 70) score = Math.min(100, score + 5);
    if (name === 'History' && totalPercentage < 60) score = Math.max(30, score - 5);

    score = Math.round(score);
    const classAverage = Math.round(totalPercentage - 8 + ((index * 3) % 10));
    const position = Math.max(1, Math.min(totalStudents, Math.round(totalStudents * (1 - score / 100) + (index % 5))));

    return {
      name,
      score,
      grade: getGradeFromScore(score),
      classAverage: Math.max(40, Math.min(85, classAverage)),
      position,
      totalStudents,
    };
  });
}

// Get remarks based on performance
function getRemarks(totalPercentage: number): { classTeacher: string; principal: string } {
  if (totalPercentage >= 80) {
    return {
      classTeacher: 'Outstanding performance! A brilliant student who consistently exceeds expectations.',
      principal: 'Exceptional academic achievement. Keep up the excellent work!',
    };
  } else if (totalPercentage >= 70) {
    return {
      classTeacher: 'A dedicated student who shows great potential. Very good performance this term.',
      principal: 'Excellent performance! Keep up the good work.',
    };
  } else if (totalPercentage >= 60) {
    return {
      classTeacher: 'Good effort this term. With more focus, even better results are achievable.',
      principal: 'Satisfactory performance. Continue to work hard.',
    };
  } else if (totalPercentage >= 50) {
    return {
      classTeacher: 'Average performance. More attention to studies is needed for improvement.',
      principal: 'Needs to put in more effort. We believe you can do better.',
    };
  } else {
    return {
      classTeacher: 'Performance needs significant improvement. Extra tutoring is recommended.',
      principal: 'Below average performance. A meeting with parents is advised to discuss improvement strategies.',
    };
  }
}

function getGradeColor(grade: string) {
  switch (grade) {
    case 'A': return '#10b981';
    case 'B': return '#3b82f6';
    case 'C': return '#f59e0b';
    case 'D': return '#f97316';
    default: return '#ef4444';
  }
}

function getGradeBgColor(grade: string) {
  switch (grade) {
    case 'A': return '#ecfdf5';
    case 'B': return '#eff6ff';
    case 'C': return '#fffbeb';
    case 'D': return '#fff7ed';
    default: return '#fef2f2';
  }
}

function getScoreColor(score: number) {
  if (score >= 70) return '#10b981';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

// Subject Card Component
function SubjectCard({ subject, colors, isTablet }: { subject: SubjectResult; colors: any; isTablet: boolean }) {
  const isAboveAverage = subject.score > subject.classAverage;
  const diff = subject.score - subject.classAverage;

  return (
    <View style={[styles.subjectCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {/* Subject Header */}
      <View style={styles.subjectHeader}>
        <View style={styles.subjectNameContainer}>
          <View style={[styles.gradeCircle, { backgroundColor: getGradeBgColor(subject.grade) }]}>
            <Text style={[styles.gradeText, { color: getGradeColor(subject.grade) }]}>{subject.grade}</Text>
          </View>
          <Text style={[styles.subjectName, { color: colors.text }]}>{subject.name}</Text>
        </View>
        <View style={[styles.scoreContainer, { backgroundColor: getGradeBgColor(subject.grade) }]}>
          <Text style={[styles.scoreText, { color: getGradeColor(subject.grade) }]}>{subject.score}%</Text>
        </View>
      </View>

      {/* Stats Row */}
      <View style={[styles.subjectStats, { borderTopColor: colors.border }]}>
        <View style={styles.subjectStatItem}>
          <Text style={[styles.subjectStatLabel, { color: colors.textMuted }]}>Class Avg</Text>
          <Text style={[styles.subjectStatValue, { color: colors.text }]}>{subject.classAverage}%</Text>
        </View>
        <View style={[styles.subjectStatDivider, { backgroundColor: colors.border }]} />
        <View style={styles.subjectStatItem}>
          <Text style={[styles.subjectStatLabel, { color: colors.textMuted }]}>Position</Text>
          <Text style={[styles.subjectStatValue, { color: colors.text }]}>#{subject.position}</Text>
        </View>
        <View style={[styles.subjectStatDivider, { backgroundColor: colors.border }]} />
        <View style={styles.subjectStatItem}>
          <Text style={[styles.subjectStatLabel, { color: colors.textMuted }]}>vs Avg</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
            <Ionicons
              name={isAboveAverage ? 'arrow-up' : 'arrow-down'}
              size={12}
              color={isAboveAverage ? '#10b981' : '#ef4444'}
            />
            <Text style={[styles.subjectStatValue, { color: isAboveAverage ? '#10b981' : '#ef4444' }]}>
              {Math.abs(diff)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

export default function ReportDetailsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams();
  const isTablet = useIsTablet();

  const [isSharing, setIsSharing] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  // Extract params from navigation
  const childName = (params.childName as string) || 'Adaeze Okonkwo';
  const childClass = (params.childClass as string) || 'JSS 2';
  const childAvatar = 'https://i.pravatar.cc/150?u=adaeze';
  const reportId = (params.reportId as string) || 'report-001';

  // Build report data from params
  const totalPercentage = parseInt(params.totalPercentage as string) || 78;
  const rank = parseInt(params.rank as string) || 5;
  const totalStudents = parseInt(params.totalStudents as string) || 45;
  const subjectCount = parseInt(params.subjects as string) || 8;
  const examType = (params.examType as string) || 'Third Term Exam';
  const term = (params.term as string) || 'Term 3';
  const year = (params.year as string) || '2024';
  const status = (params.status as string) || 'pass';
  const datePublished = (params.datePublished as string) || '2024-12-15';

  // Generate academic session from year
  const academicSession = `${parseInt(year) - 1}/${year}`;

  // Generate subjects based on report params
  const subjects = generateSubjectsForReport(reportId, totalPercentage, subjectCount, totalStudents);

  // Get remarks based on performance
  const remarks = getRemarks(totalPercentage);

  // Calculate attendance based on performance (mock correlation)
  const attendanceRate = Math.min(98, Math.max(70, totalPercentage + 15));
  const totalDays = 60;
  const daysPresent = Math.round((attendanceRate / 100) * totalDays);

  // Build report object
  const report = {
    id: reportId,
    examType,
    term,
    year,
    academicSession,
    totalPercentage,
    rank,
    totalStudents,
    status: status as 'pass' | 'fail',
    datePublished,
    attendanceRate,
    daysPresent,
    totalDays,
    principalRemark: remarks.principal,
    classTeacherRemark: remarks.classTeacher,
    subjects,
  };

  // Calculate stats
  const totalScore = report.subjects.reduce((sum, s) => sum + s.score, 0);
  const averageScore = Math.round(totalScore / report.subjects.length);
  const highestSubject = report.subjects.reduce((max, s) => s.score > max.score ? s : max, report.subjects[0]);
  const lowestSubject = report.subjects.reduce((min, s) => s.score < min.score ? s : min, report.subjects[0]);
  const gradeACount = report.subjects.filter(s => s.grade === 'A').length;

  // Generate HTML for PDF
  const generateReportHTML = () => {
    const subjectRows = report.subjects.map(subject => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${subject.name}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          <span style="background: ${getGradeBgColor(subject.grade)}; color: ${getGradeColor(subject.grade)}; padding: 4px 12px; border-radius: 6px; font-weight: 600;">${subject.grade}</span>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; font-weight: 600;">${subject.score}%</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">${subject.classAverage}%</td>
        <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">#${subject.position}</td>
      </tr>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Report Card - ${childName}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; background: #ffffff; color: #1f2937; }
            .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #6366f1; }
            .school-name { font-size: 24px; font-weight: 700; color: #6366f1; margin-bottom: 5px; }
            .report-title { font-size: 16px; color: #6b7280; }
            .student-info { display: flex; justify-content: space-between; margin-bottom: 30px; padding: 20px; background: #f9fafb; border-radius: 12px; }
            .info-group { }
            .info-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
            .info-value { font-size: 16px; font-weight: 600; color: #1f2937; }
            .performance-box { text-align: center; padding: 30px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); border-radius: 16px; color: white; margin-bottom: 30px; }
            .score-big { font-size: 48px; font-weight: 700; }
            .score-label { font-size: 14px; opacity: 0.9; margin-top: 5px; }
            .stats-row { display: flex; justify-content: space-around; margin-top: 20px; }
            .stat-item { text-align: center; }
            .stat-value { font-size: 20px; font-weight: 600; }
            .stat-label { font-size: 12px; opacity: 0.8; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            th { background: #f3f4f6; padding: 14px; text-align: left; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb; }
            th:not(:first-child) { text-align: center; }
            .section-title { font-size: 18px; font-weight: 600; margin-bottom: 15px; color: #1f2937; }
            .remarks-box { padding: 20px; background: #f9fafb; border-radius: 12px; margin-bottom: 20px; }
            .remark-label { font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px; }
            .remark-text { font-size: 14px; line-height: 1.6; color: #374151; }
            .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="school-name">Educo Academy</div>
            <div class="report-title">${report.examType} Report Card • ${report.academicSession}</div>
          </div>

          <div class="student-info">
            <div class="info-group">
              <div class="info-label">Student Name</div>
              <div class="info-value">${childName}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Class</div>
              <div class="info-value">${childClass}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Term</div>
              <div class="info-value">${report.term}</div>
            </div>
            <div class="info-group">
              <div class="info-label">Date Published</div>
              <div class="info-value">${formatDate(report.datePublished)}</div>
            </div>
          </div>

          <div class="performance-box">
            <div class="score-big">${report.totalPercentage}%</div>
            <div class="score-label">Overall Performance</div>
            <div class="stats-row">
              <div class="stat-item">
                <div class="stat-value">#${report.rank}</div>
                <div class="stat-label">Class Rank</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${gradeACount}</div>
                <div class="stat-label">A Grades</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${report.attendanceRate}%</div>
                <div class="stat-label">Attendance</div>
              </div>
            </div>
          </div>

          <div class="section-title">Subject Results</div>
          <table>
            <thead>
              <tr>
                <th>Subject</th>
                <th>Grade</th>
                <th>Score</th>
                <th>Class Avg</th>
                <th>Position</th>
              </tr>
            </thead>
            <tbody>
              ${subjectRows}
            </tbody>
          </table>

          <div class="section-title">Remarks</div>
          <div class="remarks-box">
            <div class="remark-label">Class Teacher's Remark</div>
            <div class="remark-text">${report.classTeacherRemark}</div>
          </div>
          <div class="remarks-box">
            <div class="remark-label">Principal's Remark</div>
            <div class="remark-text">${report.principalRemark}</div>
          </div>

          <div class="footer">
            Generated on ${new Date().toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </body>
      </html>
    `;
  };

  // Handle Share
  const handleShare = async () => {
    setIsSharing(true);
    try {
      const shareMessage = `📊 Report Card for ${childName}\n\n` +
        `📚 ${report.examType} - ${report.academicSession}\n` +
        `🎓 Class: ${childClass}\n\n` +
        `✨ Overall Score: ${report.totalPercentage}%\n` +
        `🏆 Class Rank: #${report.rank} of ${report.totalStudents}\n` +
        `📅 Attendance: ${report.attendanceRate}%\n\n` +
        `Top Subject: ${highestSubject.name} (${highestSubject.score}%)\n\n` +
        `Shared via Educo App`;

      await Share.share({
        message: shareMessage,
        title: `Report Card - ${childName}`,
      });
    } catch (error: any) {
      if (error.message !== 'User did not share') {
        Alert.alert('Error', 'Failed to share report. Please try again.');
      }
    } finally {
      setIsSharing(false);
    }
  };

  // Handle Download (PDF Generation)
  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const html = generateReportHTML();

      // Generate PDF
      const { uri } = await Print.printToFileAsync({
        html,
        base64: false,
      });

      // Check if sharing is available
      const isAvailable = await Sharing.isAvailableAsync();

      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Report Card - ${childName}`,
          UTI: 'com.adobe.pdf',
        });
      } else {
        Alert.alert(
          'PDF Generated',
          'The report card has been generated successfully. The file sharing feature is not available on this device.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Download error:', error);
      Alert.alert('Error', 'Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  // Get score ring color
  const getScoreRingColor = (): readonly [string, string] => {
    if (report.totalPercentage >= 70) return ['#10b981', '#059669'] as const;
    if (report.totalPercentage >= 50) return ['#f59e0b', '#d97706'] as const;
    return ['#ef4444', '#dc2626'] as const;
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {/* Fixed Header */}
      <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.backgroundTertiary }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Report Card</Text>
        <Pressable
          style={[styles.shareButton, { backgroundColor: colors.backgroundTertiary }]}
          onPress={handleShare}
          disabled={isSharing}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <Ionicons name="share-outline" size={20} color={colors.text} />
          )}
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, isTablet && styles.scrollContentTablet]}
        showsVerticalScrollIndicator={false}
      >
        {/* TABLET: Modern Clean Layout */}
        {isTablet ? (
          <View style={styles.tabletContainer}>
            {/* Left Column */}
            <View style={styles.tabletLeftColumn}>
              {/* Student Header Card - Clean Design */}
              <View style={[styles.studentHeaderCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.studentHeaderTop}>
                  <View style={styles.studentAvatarSection}>
                    <LinearGradient
                      colors={['#6366f1', '#8b5cf6']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.studentAvatarRing}
                    >
                      <View style={[styles.studentAvatarInner, { backgroundColor: colors.surface }]}>
                        <Image source={{ uri: childAvatar }} style={styles.studentAvatarImg} />
                      </View>
                    </LinearGradient>
                  </View>
                  <View style={styles.studentInfoSection}>
                    <Text style={[styles.studentNameText, { color: colors.text }]}>{childName}</Text>
                    <View style={styles.studentBadgesRow}>
                      <View style={[styles.studentClassBadge, { backgroundColor: colors.primaryLight }]}>
                        <Ionicons name="school" size={12} color={colors.primary} />
                        <Text style={[styles.studentClassText, { color: colors.primary }]}>{childClass}</Text>
                      </View>
                      <View style={[styles.studentSessionBadge, { backgroundColor: colors.backgroundTertiary }]}>
                        <Text style={[styles.studentSessionText, { color: colors.textSecondary }]}>{report.academicSession}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={[styles.examInfoBar, { backgroundColor: colors.backgroundTertiary }]}>
                  <View style={styles.examInfoItemNew}>
                    <Ionicons name="document-text" size={16} color={colors.primary} />
                    <Text style={[styles.examInfoTextNew, { color: colors.text }]}>{report.examType}</Text>
                  </View>
                  <View style={[styles.examInfoDot, { backgroundColor: colors.border }]} />
                  <View style={styles.examInfoItemNew}>
                    <Ionicons name="calendar" size={16} color={colors.primary} />
                    <Text style={[styles.examInfoTextNew, { color: colors.text }]}>{formatDate(report.datePublished)}</Text>
                  </View>
                </View>
              </View>

              {/* Performance Card - Modern Grid */}
              <View style={[styles.performanceCardNew, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.performanceLayout}>
                  {/* Score Circle */}
                  <View style={styles.scoreAreaNew}>
                    <LinearGradient
                      colors={getScoreRingColor()}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.scoreRingNew}
                    >
                      <View style={[styles.scoreInnerNew, { backgroundColor: colors.surface }]}>
                        <Text style={[styles.scoreValueNew, { color: colors.text }]}>{report.totalPercentage}</Text>
                        <Text style={[styles.scorePercentNew, { color: colors.textMuted }]}>%</Text>
                      </View>
                    </LinearGradient>
                    <Text style={[styles.scoreLabelNew, { color: colors.textMuted }]}>Overall Score</Text>
                  </View>

                  {/* Stats Grid - 2x2 */}
                  <View style={styles.statsGridNew}>
                    <View style={[styles.statCardNew, { backgroundColor: colors.backgroundTertiary }]}>
                      <View style={[styles.statIconNew, { backgroundColor: '#fef3c7' }]}>
                        <Ionicons name="trophy" size={20} color="#f59e0b" />
                      </View>
                      <Text style={[styles.statValueNew, { color: colors.text }]}>#{report.rank}</Text>
                      <Text style={[styles.statLabelNew, { color: colors.textMuted }]}>of {report.totalStudents}</Text>
                    </View>
                    <View style={[styles.statCardNew, { backgroundColor: colors.backgroundTertiary }]}>
                      <View style={[styles.statIconNew, { backgroundColor: '#eff6ff' }]}>
                        <Ionicons name="book" size={20} color="#3b82f6" />
                      </View>
                      <Text style={[styles.statValueNew, { color: colors.text }]}>{report.subjects.length}</Text>
                      <Text style={[styles.statLabelNew, { color: colors.textMuted }]}>Subjects</Text>
                    </View>
                    <View style={[styles.statCardNew, { backgroundColor: colors.backgroundTertiary }]}>
                      <View style={[styles.statIconNew, { backgroundColor: '#ecfdf5' }]}>
                        <Ionicons name="ribbon" size={20} color="#10b981" />
                      </View>
                      <Text style={[styles.statValueNew, { color: colors.text }]}>{gradeACount}</Text>
                      <Text style={[styles.statLabelNew, { color: colors.textMuted }]}>A Grades</Text>
                    </View>
                    <View style={[styles.statCardNew, { backgroundColor: report.status === 'pass' ? '#ecfdf5' : '#fef2f2' }]}>
                      <View style={[styles.statIconNew, { backgroundColor: report.status === 'pass' ? '#d1fae5' : '#fecaca' }]}>
                        <Ionicons name={report.status === 'pass' ? 'checkmark-circle' : 'close-circle'} size={20} color={report.status === 'pass' ? '#10b981' : '#ef4444'} />
                      </View>
                      <Text style={[styles.statValueNew, { color: report.status === 'pass' ? '#10b981' : '#ef4444' }]}>
                        {report.status === 'pass' ? 'Passed' : 'Failed'}
                      </Text>
                      <Text style={[styles.statLabelNew, { color: colors.textMuted }]}>Status</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Highlights Row */}
              <View style={styles.highlightsRowNew}>
                <View style={[styles.highlightCardNew2, { backgroundColor: '#f0fdf4' }]}>
                  <View style={styles.highlightTopNew}>
                    <Ionicons name="trending-up" size={20} color="#10b981" />
                    <Text style={styles.highlightLabelNew2}>BEST</Text>
                  </View>
                  <Text style={[styles.highlightSubjectNew, { color: colors.text }]}>{highestSubject.name}</Text>
                  <Text style={styles.highlightScoreNew2}>{highestSubject.score}%</Text>
                </View>
                <View style={[styles.highlightCardNew2, { backgroundColor: '#fef2f2' }]}>
                  <View style={styles.highlightTopNew}>
                    <Ionicons name="trending-down" size={20} color="#ef4444" />
                    <Text style={[styles.highlightLabelNew2, { color: '#ef4444' }]}>IMPROVE</Text>
                  </View>
                  <Text style={[styles.highlightSubjectNew, { color: colors.text }]}>{lowestSubject.name}</Text>
                  <Text style={[styles.highlightScoreNew2, { color: '#ef4444' }]}>{lowestSubject.score}%</Text>
                </View>
              </View>

              {/* Remarks */}
              <View style={[styles.remarksCardNew, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.remarksTitleNew, { color: colors.text }]}>Remarks</Text>
                <View style={[styles.remarkBoxNew, { backgroundColor: colors.backgroundTertiary }]}>
                  <View style={styles.remarkHeaderNew}>
                    <Ionicons name="person" size={16} color="#3b82f6" />
                    <Text style={[styles.remarkLabelNew, { color: colors.textMuted }]}>Class Teacher</Text>
                  </View>
                  <Text style={[styles.remarkTextNew, { color: colors.text }]}>{report.classTeacherRemark}</Text>
                </View>
                <View style={[styles.remarkBoxNew, { backgroundColor: colors.backgroundTertiary, marginTop: 12 }]}>
                  <View style={styles.remarkHeaderNew}>
                    <Ionicons name="school" size={16} color="#f59e0b" />
                    <Text style={[styles.remarkLabelNew, { color: colors.textMuted }]}>Principal</Text>
                  </View>
                  <Text style={[styles.remarkTextNew, { color: colors.text }]}>{report.principalRemark}</Text>
                </View>
              </View>

              {/* Attendance */}
              <View style={[styles.attendanceCardNew, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.attendanceTopNew}>
                  <View style={styles.attendanceTitleRow}>
                    <Ionicons name="calendar" size={18} color={colors.primary} />
                    <Text style={[styles.attendanceTitleNew, { color: colors.text }]}>Attendance</Text>
                  </View>
                  <Text style={styles.attendanceRateNew}>{report.attendanceRate}%</Text>
                </View>
                <View style={[styles.attendanceProgressBg, { backgroundColor: colors.backgroundTertiary }]}>
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.attendanceProgressFill, { width: `${report.attendanceRate}%` }]}
                  />
                </View>
                <View style={styles.attendanceStatsNew}>
                  <View style={styles.attendanceStatItemNew}>
                    <Text style={[styles.attendanceStatNumNew, { color: '#10b981' }]}>{report.daysPresent}</Text>
                    <Text style={[styles.attendanceStatTextNew, { color: colors.textMuted }]}>Present</Text>
                  </View>
                  <View style={styles.attendanceStatItemNew}>
                    <Text style={[styles.attendanceStatNumNew, { color: '#ef4444' }]}>{report.totalDays - report.daysPresent}</Text>
                    <Text style={[styles.attendanceStatTextNew, { color: colors.textMuted }]}>Absent</Text>
                  </View>
                  <View style={styles.attendanceStatItemNew}>
                    <Text style={[styles.attendanceStatNumNew, { color: colors.text }]}>{report.totalDays}</Text>
                    <Text style={[styles.attendanceStatTextNew, { color: colors.textMuted }]}>Total</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Right Column - Subjects */}
            <View style={styles.tabletRightColumn}>
              <View style={[styles.subjectsCardNew, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={styles.subjectsHeaderNew}>
                  <Text style={[styles.subjectsTitleNew, { color: colors.text }]}>Subject Results</Text>
                  <View style={[styles.subjectsBadgeNew, { backgroundColor: colors.primaryLight }]}>
                    <Text style={[styles.subjectsBadgeText, { color: colors.primary }]}>{report.subjects.length}</Text>
                  </View>
                </View>

                {/* Subject Grid */}
                <View style={styles.subjectsGridNew}>
                  {report.subjects.map((subject) => (
                    <View key={subject.name} style={[styles.subjectItemNew, { backgroundColor: colors.backgroundTertiary }]}>
                      <View style={styles.subjectItemTop}>
                        <View style={[styles.subjectGradeBox, { backgroundColor: getGradeBgColor(subject.grade) }]}>
                          <Text style={[styles.subjectGradeLetter, { color: getGradeColor(subject.grade) }]}>{subject.grade}</Text>
                        </View>
                        <Text style={[styles.subjectScoreNum, { color: getGradeColor(subject.grade) }]}>{subject.score}%</Text>
                      </View>
                      <Text style={[styles.subjectItemName, { color: colors.text }]} numberOfLines={1}>{subject.name}</Text>
                      <Text style={[styles.subjectItemMeta, { color: colors.textMuted }]}>Rank #{subject.position} • Avg {subject.classAverage}%</Text>
                      <View style={[styles.subjectProgressBg, { backgroundColor: colors.border }]}>
                        <View style={[styles.subjectProgressFill, { width: `${subject.score}%`, backgroundColor: getGradeColor(subject.grade) }]} />
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              {/* Download Button */}
              <Pressable style={styles.downloadBtnNew} onPress={handleDownload} disabled={isDownloading}>
                <LinearGradient
                  colors={isDownloading ? ['#9ca3af', '#9ca3af'] : ['#6366f1', '#8b5cf6']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.downloadBtnGradient}
                >
                  {isDownloading ? (
                    <ActivityIndicator size="small" color="#ffffff" />
                  ) : (
                    <Ionicons name="download-outline" size={20} color="#ffffff" />
                  )}
                  <Text style={styles.downloadBtnText}>
                    {isDownloading ? 'Generating...' : 'Download Report Card'}
                  </Text>
                </LinearGradient>
              </Pressable>
            </View>
          </View>
        ) : (
          /* MOBILE: Single Column Layout */
          <>
            {/* Student Info Card */}
            <View style={[styles.studentCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.studentInfo}>
                <View style={styles.avatarWrapper}>
                  <LinearGradient
                    colors={['#6366f1', '#8b5cf6', '#a855f7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.avatarGradient}
                  >
                    <View style={[styles.avatarInner, { backgroundColor: colors.surface }]}>
                      <Image source={{ uri: childAvatar }} style={styles.avatar} />
                    </View>
                  </LinearGradient>
                </View>
                <View style={styles.studentDetails}>
                  <Text style={[styles.studentName, { color: colors.text }]}>{childName}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                    <View style={[styles.classBadge, { backgroundColor: colors.primaryLight }]}>
                      <Ionicons name="school" size={12} color={colors.primary} />
                      <Text style={[styles.classBadgeText, { color: colors.primary }]}>{childClass}</Text>
                    </View>
                    <View style={[styles.sessionBadge, { backgroundColor: colors.backgroundTertiary }]}>
                      <Text style={[styles.sessionText, { color: colors.textSecondary }]}>{report.academicSession}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[styles.examInfoRow, { borderTopColor: colors.border }]}>
                <View style={styles.examInfoItem}>
                  <Ionicons name="document-text-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.examInfoText, { color: colors.text }]}>{report.examType}</Text>
                </View>
                <View style={[styles.examInfoDivider, { backgroundColor: colors.border }]} />
                <View style={styles.examInfoItem}>
                  <Ionicons name="calendar-outline" size={16} color={colors.textMuted} />
                  <Text style={[styles.examInfoText, { color: colors.text }]}>{formatDate(report.datePublished)}</Text>
                </View>
              </View>
            </View>

            {/* Performance Card */}
            <View style={[styles.performanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.performanceTop}>
                <View style={styles.scoreCircleWrapper}>
                  <LinearGradient
                    colors={getScoreRingColor()}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.scoreGradientRing}
                  >
                    <View style={[styles.scoreInnerCircle, { backgroundColor: colors.surface }]}>
                      <Text style={[styles.scoreMainValue, { color: colors.text }]}>{report.totalPercentage}</Text>
                      <Text style={[styles.scorePercentSign, { color: colors.textMuted }]}>%</Text>
                    </View>
                  </LinearGradient>
                  <Text style={[styles.scoreLabel, { color: colors.textMuted }]}>Overall Score</Text>
                </View>
                <View style={styles.performanceStats}>
                  <View style={[styles.performanceStatRow, { backgroundColor: colors.backgroundTertiary }]}>
                    <View style={[styles.performanceStatIcon, { backgroundColor: '#fef3c7' }]}>
                      <Ionicons name="trophy" size={16} color="#f59e0b" />
                    </View>
                    <View style={styles.performanceStatContent}>
                      <Text style={[styles.performanceStatValue, { color: colors.text }]}>#{report.rank}</Text>
                      <Text style={[styles.performanceStatLabel, { color: colors.textMuted }]}>of {report.totalStudents} students</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadgeNew, { backgroundColor: report.status === 'pass' ? '#ecfdf5' : '#fef2f2' }]}>
                    <View style={[styles.statusDot, { backgroundColor: report.status === 'pass' ? '#10b981' : '#ef4444' }]} />
                    <Text style={[styles.statusTextNew, { color: report.status === 'pass' ? '#059669' : '#dc2626' }]}>
                      {report.status === 'pass' ? 'Passed' : 'Failed'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Stats */}
            <View style={styles.quickStatsRow}>
              <View style={[styles.quickStatCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.quickStatIcon, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="book-outline" size={16} color="#3b82f6" />
                </View>
                <Text style={[styles.quickStatValue, { color: colors.text }]}>{report.subjects.length}</Text>
                <Text style={[styles.quickStatLabel, { color: colors.textMuted }]}>Subjects</Text>
              </View>
              <View style={[styles.quickStatCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.quickStatIcon, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="ribbon-outline" size={16} color="#10b981" />
                </View>
                <Text style={[styles.quickStatValue, { color: colors.text }]}>{gradeACount}</Text>
                <Text style={[styles.quickStatLabel, { color: colors.textMuted }]}>A Grades</Text>
              </View>
              <View style={[styles.quickStatCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.quickStatIcon, { backgroundColor: '#fef3c7' }]}>
                  <Ionicons name="stats-chart-outline" size={16} color="#f59e0b" />
                </View>
                <Text style={[styles.quickStatValue, { color: colors.text }]}>{averageScore}%</Text>
                <Text style={[styles.quickStatLabel, { color: colors.textMuted }]}>Average</Text>
              </View>
              <View style={[styles.quickStatCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.quickStatIcon, { backgroundColor: '#fce7f3' }]}>
                  <Ionicons name="calendar-outline" size={16} color="#ec4899" />
                </View>
                <Text style={[styles.quickStatValue, { color: colors.text }]}>{report.attendanceRate}%</Text>
                <Text style={[styles.quickStatLabel, { color: colors.textMuted }]}>Attend.</Text>
              </View>
            </View>

            {/* Highlights */}
            <View style={styles.highlightsRow}>
              <View style={[styles.highlightCardNew, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.highlightIconWrap, { backgroundColor: '#ecfdf5' }]}>
                  <Ionicons name="trending-up" size={18} color="#10b981" />
                </View>
                <View style={styles.highlightTextWrap}>
                  <Text style={[styles.highlightLabelNew, { color: colors.textMuted }]}>Best</Text>
                  <Text style={[styles.highlightValueNew, { color: colors.text }]} numberOfLines={1}>{highestSubject.name}</Text>
                  <Text style={[styles.highlightScoreNew, { color: '#10b981' }]}>{highestSubject.score}%</Text>
                </View>
              </View>
              <View style={[styles.highlightCardNew, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <View style={[styles.highlightIconWrap, { backgroundColor: '#fef2f2' }]}>
                  <Ionicons name="trending-down" size={18} color="#ef4444" />
                </View>
                <View style={styles.highlightTextWrap}>
                  <Text style={[styles.highlightLabelNew, { color: colors.textMuted }]}>Improve</Text>
                  <Text style={[styles.highlightValueNew, { color: colors.text }]} numberOfLines={1}>{lowestSubject.name}</Text>
                  <Text style={[styles.highlightScoreNew, { color: '#ef4444' }]}>{lowestSubject.score}%</Text>
                </View>
              </View>
            </View>

            {/* Subject Results */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Subject Results</Text>
              <Text style={[styles.sectionSubtitle, { color: colors.textMuted }]}>{report.subjects.length} subjects</Text>
            </View>

            <View style={styles.subjectsContainer}>
              {report.subjects.map((subject) => (
                <SubjectCard key={subject.name} subject={subject} colors={colors} isTablet={isTablet} />
              ))}
            </View>

            {/* Remarks */}
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Remarks</Text>
            </View>

            <View style={[styles.remarksCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.remarkItem}>
                <View style={styles.remarkHeader}>
                  <View style={[styles.remarkIcon, { backgroundColor: '#eff6ff' }]}>
                    <Ionicons name="person" size={16} color="#3b82f6" />
                  </View>
                  <Text style={[styles.remarkLabel, { color: colors.textSecondary }]}>Class Teacher</Text>
                </View>
                <Text style={[styles.remarkText, { color: colors.text }]}>{report.classTeacherRemark}</Text>
              </View>
              <View style={[styles.remarkDivider, { backgroundColor: colors.border }]} />
              <View style={styles.remarkItem}>
                <View style={styles.remarkHeader}>
                  <View style={[styles.remarkIcon, { backgroundColor: '#fef3c7' }]}>
                    <Ionicons name="school" size={16} color="#f59e0b" />
                  </View>
                  <Text style={[styles.remarkLabel, { color: colors.textSecondary }]}>Principal</Text>
                </View>
                <Text style={[styles.remarkText, { color: colors.text }]}>{report.principalRemark}</Text>
              </View>
            </View>

            {/* Attendance */}
            <View style={[styles.attendanceCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={styles.attendanceHeader}>
                <Ionicons name="calendar-outline" size={20} color={colors.primary} />
                <Text style={[styles.attendanceTitle, { color: colors.text }]}>Attendance Record</Text>
              </View>
              <View style={styles.attendanceStats}>
                <View style={styles.attendanceStat}>
                  <Text style={[styles.attendanceValue, { color: colors.text }]}>{report.daysPresent}</Text>
                  <Text style={[styles.attendanceLabel, { color: colors.textMuted }]}>Days Present</Text>
                </View>
                <View style={[styles.attendanceDivider, { backgroundColor: colors.border }]} />
                <View style={styles.attendanceStat}>
                  <Text style={[styles.attendanceValue, { color: colors.text }]}>{report.totalDays - report.daysPresent}</Text>
                  <Text style={[styles.attendanceLabel, { color: colors.textMuted }]}>Days Absent</Text>
                </View>
                <View style={[styles.attendanceDivider, { backgroundColor: colors.border }]} />
                <View style={styles.attendanceStat}>
                  <Text style={[styles.attendanceValue, { color: '#10b981' }]}>{report.attendanceRate}%</Text>
                  <Text style={[styles.attendanceLabel, { color: colors.textMuted }]}>Rate</Text>
                </View>
              </View>
            </View>

            {/* Download Button */}
            <Pressable style={styles.downloadButton} onPress={handleDownload} disabled={isDownloading}>
              <LinearGradient
                colors={isDownloading ? ['#9ca3af', '#9ca3af'] : ['#6366f1', '#8b5cf6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.downloadButtonGradient}
              >
                {isDownloading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Ionicons name="download-outline" size={20} color="#ffffff" />
                )}
                <Text style={styles.downloadButtonText}>
                  {isDownloading ? 'Generating PDF...' : 'Download Report Card'}
                </Text>
              </LinearGradient>
            </Pressable>
          </>
        )}

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
    borderBottomWidth: 1,
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  scrollContentTablet: {
    paddingHorizontal: 24,
    paddingTop: 20,
    maxWidth: 1200,
    alignSelf: 'center',
    width: '100%',
  },
  // Student Card
  studentCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
  },
  avatarGradient: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 29,
    padding: 2,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 27,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  classBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  sessionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  sessionText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  examInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },
  examInfoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  examInfoText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  examInfoDivider: {
    width: 1,
    height: 20,
    marginHorizontal: 12,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
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
  // New Performance Card Styles
  performanceCard: {
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 16,
    overflow: 'hidden',
  },
  performanceTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    gap: 20,
  },
  // Modern Score Circle with Gradient Ring
  scoreCircleWrapper: {
    alignItems: 'center',
  },
  scoreGradientRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    padding: 4,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  scoreInnerCircle: {
    flex: 1,
    borderRadius: 51,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreMainValue: {
    fontSize: 36,
    fontFamily: FONTS.bold,
  },
  scorePercentSign: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    marginTop: 6,
    marginLeft: 1,
  },
  scoreLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 10,
  },
  performanceStats: {
    flex: 1,
    gap: 10,
  },
  performanceStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  performanceStatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  performanceStatContent: {
    flex: 1,
  },
  performanceStatValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  performanceStatLabel: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  statusBadgeNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusTextNew: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  // Quick Stats Row - Separate Cards
  quickStatsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  quickStatCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  quickStatIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickStatValue: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  quickStatLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 2,
    textAlign: 'center',
  },
  // New Highlights Row
  highlightsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  highlightCardNew: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    gap: 10,
  },
  highlightIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightTextWrap: {
    flex: 1,
  },
  highlightLabelNew: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  highlightValueNew: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    marginTop: 2,
  },
  highlightScoreNew: {
    fontSize: 12,
    fontFamily: FONTS.bold,
    marginTop: 1,
  },
  // Subject Cards
  subjectsContainer: {
    gap: 10,
  },
  subjectsContainerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  subjectCardWrapper: {
    width: '48.5%',
  },
  subjectCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
  },
  subjectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
  },
  subjectNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  gradeCircle: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradeText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  subjectName: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    flex: 1,
  },
  scoreContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  scoreText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  subjectStats: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderTopWidth: 1,
  },
  subjectStatItem: {
    flex: 1,
    alignItems: 'center',
  },
  subjectStatLabel: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginBottom: 2,
  },
  subjectStatValue: {
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  subjectStatDivider: {
    width: 1,
    height: 24,
    marginHorizontal: 8,
  },
  // Remarks
  remarksCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  remarkItem: {
    padding: 16,
  },
  remarkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  remarkIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remarkLabel: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  remarkText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    lineHeight: 20,
  },
  remarkDivider: {
    height: 1,
    marginHorizontal: 16,
  },
  // Attendance
  attendanceCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
  },
  attendanceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  attendanceTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  attendanceStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attendanceStat: {
    flex: 1,
    alignItems: 'center',
  },
  attendanceValue: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  attendanceLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },
  attendanceDivider: {
    width: 1,
    height: 40,
    marginHorizontal: 8,
  },
  // Download Button
  downloadButton: {
    marginTop: 24,
    borderRadius: 14,
    overflow: 'hidden',
  },
  downloadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  downloadButtonText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: '#ffffff',
  },

  // =============================================
  // TABLET STYLES - Two Column Layout
  // =============================================
  tabletContainer: {
    flexDirection: 'row',
    gap: 20,
  },
  tabletLeftColumn: {
    flex: 1.2,
    gap: 12,
    maxWidth: 680,
  },
  tabletRightColumn: {
    flex: 0.8,
    gap: 12,
    maxWidth: 460,
  },

  // Hero Card (Tablet)
  heroCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
  },
  heroGradient: {
    padding: 24,
  },
  heroStudentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  heroAvatarWrapper: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
    overflow: 'hidden',
  },
  heroAvatar: {
    width: '100%',
    height: '100%',
  },
  heroStudentInfo: {
    flex: 1,
  },
  heroStudentName: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: '#ffffff',
    marginBottom: 8,
  },
  heroBadgesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  heroBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
  heroExamBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  heroExamText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: 'rgba(255,255,255,0.9)',
  },
  heroExamDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  // Hero Score Section
  heroScoreSection: {
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },
  heroScoreWrapper: {
    alignItems: 'center',
  },
  heroScoreRing: {
    width: 130,
    height: 130,
    borderRadius: 65,
    padding: 5,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 10,
  },
  heroScoreInner: {
    flex: 1,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  heroScoreValue: {
    fontSize: 44,
    fontFamily: FONTS.bold,
  },
  heroScorePercent: {
    fontSize: 20,
    fontFamily: FONTS.semiBold,
    marginTop: 8,
    marginLeft: 2,
  },
  heroScoreLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 12,
  },

  // Hero Stats Grid
  heroStatsGrid: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  heroStatItem: {
    width: '45%',
    alignItems: 'center',
    paddingVertical: 12,
  },
  heroStatIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  heroStatValue: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  heroStatLabel: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },

  // Highlights Row (Tablet)
  highlightsRowTablet: {
    flexDirection: 'row',
    gap: 12,
  },
  highlightCardTablet: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 14,
  },
  highlightIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightContent: {
    flex: 1,
  },
  highlightLabelTablet: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  highlightValueTablet: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    marginTop: 4,
  },
  highlightScoreTablet: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginTop: 2,
  },

  // Remarks Card (Tablet)
  remarksCardTablet: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  remarksTitleTablet: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    marginBottom: 16,
  },
  remarkItemTablet: {
    flexDirection: 'row',
    gap: 14,
  },
  remarkIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  remarkContentTablet: {
    flex: 1,
  },
  remarkLabelTablet: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  remarkTextTablet: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    lineHeight: 20,
  },
  remarkDividerTablet: {
    height: 1,
    marginVertical: 16,
  },

  // Attendance Card (Tablet)
  attendanceCardTablet: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
  },
  attendanceHeaderTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  attendanceTitleTablet: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    flex: 1,
  },
  attendanceRateTablet: {
    fontSize: 20,
    fontFamily: FONTS.bold,
  },
  attendanceBarBg: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  attendanceBarFill: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  attendanceStatsRowTablet: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  attendanceStatTablet: {
    alignItems: 'center',
  },
  attendanceStatValueTablet: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  attendanceStatLabelTablet: {
    fontSize: 11,
    fontFamily: FONTS.medium,
  },

  // Subjects Card (Tablet)
  subjectsCardTablet: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  subjectsHeaderTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 16,
  },
  subjectsTitleTablet: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  subjectsCountBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  subjectsCountText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  subjectsListTablet: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  subjectRowTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  subjectLeftTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  subjectGradeBadge: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectGradeText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  subjectInfoTablet: {
    flex: 1,
  },
  subjectNameTablet: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    marginBottom: 2,
  },
  subjectMetaTablet: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  subjectRightTablet: {
    alignItems: 'flex-end',
    width: 100,
  },
  subjectScoreTablet: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 6,
  },
  subjectScoreBarBg: {
    width: '100%',
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjectScoreBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Download Button (Tablet)
  downloadButtonTablet: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  downloadButtonGradientTablet: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  downloadButtonTextTablet: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: '#ffffff',
  },

  // =============================================
  // NEW TABLET STYLES - Modern Clean Design
  // =============================================

  // Student Header Card
  studentHeaderCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  studentHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  studentAvatarSection: {
    alignItems: 'center',
  },
  studentAvatarRing: {
    width: 56,
    height: 56,
    borderRadius: 28,
    padding: 2,
  },
  studentAvatarInner: {
    flex: 1,
    borderRadius: 26,
    padding: 2,
  },
  studentAvatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  studentInfoSection: {
    flex: 1,
  },
  studentNameText: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    marginBottom: 6,
  },
  studentBadgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  studentClassBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    gap: 5,
  },
  studentClassText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  studentSessionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  studentSessionText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  examInfoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    gap: 10,
  },
  examInfoItemNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  examInfoTextNew: {
    fontSize: 13,
    fontFamily: FONTS.medium,
  },
  examInfoDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  // Performance Card - Modern
  performanceCardNew: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  performanceLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scoreAreaNew: {
    alignItems: 'center',
  },
  scoreRingNew: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  scoreInnerNew: {
    flex: 1,
    borderRadius: 47,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  scoreValueNew: {
    fontSize: 32,
    fontFamily: FONTS.bold,
  },
  scorePercentNew: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    marginTop: 4,
    marginLeft: 1,
  },
  scoreLabelNew: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 8,
  },
  statsGridNew: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCardNew: {
    width: '47%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 6,
    borderRadius: 12,
  },
  statIconNew: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  statValueNew: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  statLabelNew: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 1,
  },

  // Highlights Row - New Style
  highlightsRowNew: {
    flexDirection: 'row',
    gap: 10,
  },
  highlightCardNew2: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
  },
  highlightTopNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  highlightLabelNew2: {
    fontSize: 10,
    fontFamily: FONTS.bold,
    color: '#10b981',
    letterSpacing: 0.5,
  },
  highlightSubjectNew: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    marginBottom: 2,
  },
  highlightScoreNew2: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: '#10b981',
  },

  // Remarks Card - New
  remarksCardNew: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  remarksTitleNew: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    marginBottom: 12,
  },
  remarkBoxNew: {
    padding: 10,
    borderRadius: 12,
  },
  remarkHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  remarkLabelNew: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  remarkTextNew: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    lineHeight: 18,
  },

  // Attendance Card - New
  attendanceCardNew: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 14,
  },
  attendanceTopNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  attendanceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attendanceTitleNew: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  attendanceRateNew: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: '#10b981',
  },
  attendanceProgressBg: {
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  attendanceProgressFill: {
    height: '100%',
    borderRadius: 4,
  },
  attendanceStatsNew: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  attendanceStatItemNew: {
    alignItems: 'center',
  },
  attendanceStatNumNew: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  attendanceStatTextNew: {
    fontSize: 10,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },

  // Subjects Card - New (Grid Layout)
  subjectsCardNew: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  subjectsHeaderNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingBottom: 12,
  },
  subjectsTitleNew: {
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  subjectsBadgeNew: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  subjectsBadgeText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  subjectsGridNew: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  subjectItemNew: {
    width: '47%',
    padding: 14,
    borderRadius: 14,
  },
  subjectItemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  subjectGradeBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectGradeLetter: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  subjectScoreNum: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  subjectItemName: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    marginBottom: 4,
  },
  subjectItemMeta: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginBottom: 8,
  },
  subjectProgressBg: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  subjectProgressFill: {
    height: '100%',
    borderRadius: 3,
  },

  // Download Button - New
  downloadBtnNew: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  downloadBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  downloadBtnText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: '#ffffff',
  },
});
