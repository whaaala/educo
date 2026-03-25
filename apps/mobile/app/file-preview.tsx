import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { PageHeader } from '../components/ui/PageHeader';
import { getItem, getFileTypeConfig, formatFileSize, timeAgo } from '../components/drive/driveMockData';

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

// Mock content for different file types
function getDocumentContent(name: string): string {
  if (name.includes('Policy')) {
    return `SCHOOL POLICY DOCUMENT 2025\n\n1. Introduction\nThis document outlines the comprehensive policies and guidelines for all staff, students, and stakeholders of the institution.\n\n2. Academic Standards\nAll students are expected to maintain a minimum GPA of 2.5. Regular attendance is mandatory with a minimum of 85% attendance required per term.\n\n3. Code of Conduct\nStudents must adhere to the following behavioral expectations:\n• Respect for all members of the school community\n• Punctuality to all classes and scheduled activities\n• Proper use and care of school facilities\n• Adherence to the dress code policy\n\n4. Assessment Policy\nContinuous assessment accounts for 40% of the final grade. End-of-term examinations account for 60%. All assessments must be completed within the scheduled timeframe.\n\n5. Communication\nParents will receive termly reports on student progress. Parent-teacher conferences are held at the end of each term.`;
  }
  if (name.includes('Meeting')) {
    return `STAFF MEETING NOTES\nDate: March 20, 2026\n\nAttendees: All teaching staff\n\nAgenda:\n1. Term 2 progress review\n2. Upcoming parent-teacher day\n3. Curriculum updates for Term 3\n4. Staff development workshops\n\nKey Decisions:\n• Parent-teacher day scheduled for April 5th\n• New math curriculum to be adopted from Term 3\n• Staff development workshop on digital tools - March 28th\n\nAction Items:\n- Mrs. Eze to prepare student progress reports by March 25\n- Mr. Okafor to finalize budget allocation for new textbooks\n- All teachers to submit Term 3 lesson plans by April 1st`;
  }
  if (name.includes('Template')) {
    return `STUDENT REPORT TEMPLATE\n\nStudent Name: _______________\nClass: _______________\nTerm: _______________\n\nACADEMIC PERFORMANCE\n\nSubject          | Score | Grade | Remark\n─────────────────|───────|───────|────────\nMathematics      |       |       |\nEnglish Language  |       |       |\nScience          |       |       |\nSocial Studies   |       |       |\nArt & Craft      |       |       |\n\nATTENDANCE\nDays Present: ___  Days Absent: ___\n\nTEACHER'S COMMENT:\n___________________________________\n\nPRINCIPAL'S COMMENT:\n___________________________________`;
  }
  if (name.includes('Curriculum')) {
    return `SHARED CURRICULUM PLAN\nPrepared by: Mrs. Nkechi Eze\n\nTERM 2 CURRICULUM OVERVIEW\n\nWeek 1-2: Introduction to Fractions\n• Understanding parts of a whole\n• Comparing fractions\n• Activities: Fraction pizza game\n\nWeek 3-4: Reading Comprehension\n• Fiction vs non-fiction\n• Main idea and supporting details\n• Weekly reading journals\n\nWeek 5-6: Science - Plants\n• Parts of a plant\n• Photosynthesis basics\n• Class garden project\n\nWeek 7-8: History - Our Community\n• Local history exploration\n• Community helpers\n• Field trip to local museum`;
  }
  if (name.includes('Quick Notes')) {
    return `Quick Notes\n\n- Remember to submit term reports by Friday\n- Order new art supplies for next week\n- Schedule meeting with parents of Class 3B\n- Update classroom display board\n- Print certificates for spelling bee winners\n- Check projector in Room 204`;
  }
  return `Document Preview\n\nThis is the content of ${name}.\n\nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;
}

function getSpreadsheetData(): { headers: string[]; rows: string[][] } {
  return {
    headers: ['Student', 'Math', 'English', 'Science', 'Total', 'Grade'],
    rows: [
      ['Adaeze Obi', '85', '92', '78', '255', 'A'],
      ['Chukwuma Eze', '72', '68', '81', '221', 'B'],
      ['Fatima Bello', '91', '88', '95', '274', 'A+'],
      ['Ikenna Nwosu', '65', '73', '70', '208', 'B'],
      ['Kemi Adeyemi', '78', '82', '85', '245', 'A'],
      ['Olumide Taiwo', '88', '76', '82', '246', 'A'],
    ],
  };
}

export default function FilePreviewScreen() {
  const { colors } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const isTablet = useIsTablet();

  const item = id ? getItem(id) : null;
  if (!item) {
    return (
      <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
        <PageHeader title="File not found" showBackButton showChildSwitcher={false} />
      </SafeAreaView>
    );
  }

  const config = getFileTypeConfig(item);
  const ext = item.name.split('.').pop()?.toLowerCase();

  const renderContent = () => {
    // Spreadsheet
    if (ext === 'xlsx' || ext === 'xls' || ext === 'csv' || item.sourceType === 'spreadsheet') {
      const data = getSpreadsheetData();
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={s.table}>
            <View style={[s.tableHeaderRow, { backgroundColor: config.bgColor }]}>
              {data.headers.map((h, i) => (
                <Text key={i} style={[s.tableHeaderCell, { color: config.color }]}>{h}</Text>
              ))}
            </View>
            {data.rows.map((row, ri) => (
              <View key={ri} style={[s.tableRow, { borderBottomColor: colors.border }]}>
                {row.map((cell, ci) => (
                  <Text key={ci} style={[s.tableCell, { color: ci === 0 ? colors.text : colors.textSecondary }]}>{cell}</Text>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
    }

    // Presentation
    if (ext === 'pptx' || ext === 'ppt' || item.sourceType === 'presentation') {
      const slides = [
        { title: item.name.replace('.pptx', ''), subtitle: 'Prepared for School Assembly' },
        { title: 'Agenda', subtitle: '1. Welcome\n2. Term Highlights\n3. Achievements\n4. Upcoming Events' },
        { title: 'Term Highlights', subtitle: '• 95% attendance rate\n• 12 students on honor roll\n• Successful science fair' },
      ];
      return (
        <View style={s.slidesContainer}>
          {slides.map((slide, i) => (
            <View key={i} style={[s.slide, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[s.slideNumber, { color: colors.textMuted }]}>Slide {i + 1}</Text>
              <Text style={[s.slideTitle, { color: config.color }]}>{slide.title}</Text>
              <Text style={[s.slideSubtitle, { color: colors.textSecondary }]}>{slide.subtitle}</Text>
            </View>
          ))}
        </View>
      );
    }

    // Video
    if (ext === 'mp4' || ext === 'mov' || ext === 'avi') {
      return (
        <View style={s.mediaContainer}>
          <View style={[s.videoPlaceholder, { backgroundColor: '#111' }]}>
            <View style={[s.playButton, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
              <Ionicons name="play" size={48} color="#ffffff" />
            </View>
            <Text style={s.videoDuration}>03:42</Text>
          </View>
          <View style={s.videoControls}>
            <View style={[s.progressBar, { backgroundColor: colors.border }]}>
              <View style={[s.progressFill, { backgroundColor: config.color, width: '35%' }]} />
            </View>
            <View style={s.controlsRow}>
              <Ionicons name="play" size={24} color={colors.text} />
              <Text style={[s.timeText, { color: colors.textMuted }]}>1:18 / 3:42</Text>
              <Ionicons name="volume-medium" size={22} color={colors.textMuted} />
              <Ionicons name="expand" size={20} color={colors.textMuted} />
            </View>
          </View>
        </View>
      );
    }

    // Image
    if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif') {
      return (
        <View style={s.mediaContainer}>
          <View style={[s.imagePlaceholder, { backgroundColor: config.previewBg }]}>
            <Ionicons name="image" size={80} color={config.color} style={{ opacity: 0.4 }} />
            <Text style={[s.imagePlaceholderText, { color: config.color }]}>Image Preview</Text>
          </View>
        </View>
      );
    }

    // Document / Text / PDF — default
    const content = getDocumentContent(item.name);
    return (
      <View style={[s.docContainer, { backgroundColor: colors.surface }]}>
        <Text style={[s.docText, { color: colors.text }]}>{content}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: colors.background }]}>
      <PageHeader title={item.name} showBackButton showChildSwitcher={false} />

      {/* File info bar */}
      <View style={[s.infoBar, { backgroundColor: config.previewBg }]}>
        <Ionicons name={config.icon as any} size={20} color={config.color} />
        <Text style={[s.infoType, { color: config.color }]}>{config.label}</Text>
        {item.size && <Text style={[s.infoMeta, { color: colors.textMuted }]}>{formatFileSize(item.size)}</Text>}
        <Text style={[s.infoMeta, { color: colors.textMuted }]}>·</Text>
        <Text style={[s.infoMeta, { color: colors.textMuted }]}>{timeAgo(item.updatedAt)}</Text>
        {item.owner !== 'Me' && (
          <>
            <Text style={[s.infoMeta, { color: colors.textMuted }]}>·</Text>
            <Text style={[s.infoMeta, { color: colors.textSecondary }]}>{item.owner}</Text>
          </>
        )}
      </View>

      {/* Content */}
      <ScrollView
        style={s.scroll}
        contentContainerStyle={[s.scrollContent, isTablet && s.scrollContentTablet]}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1 },
  infoBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 6,
  },
  infoType: { fontSize: 13, fontFamily: FONTS.semiBold },
  infoMeta: { fontSize: 12, fontFamily: FONTS.regular },
  scroll: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 100 },
  scrollContentTablet: { paddingHorizontal: 32 },

  // Document
  docContainer: {
    borderRadius: 12,
    padding: 20,
    minHeight: 400,
  },
  docText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    lineHeight: 22,
  },

  // Spreadsheet
  table: { minWidth: 500 },
  tableHeaderRow: {
    flexDirection: 'row',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginBottom: 4,
  },
  tableHeaderCell: {
    width: 80,
    fontSize: 12,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  tableCell: {
    width: 80,
    fontSize: 13,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },

  // Presentation
  slidesContainer: { gap: 16 },
  slide: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    minHeight: 180,
    justifyContent: 'center',
  },
  slideNumber: { fontSize: 11, fontFamily: FONTS.medium, marginBottom: 12 },
  slideTitle: { fontSize: 22, fontFamily: FONTS.bold, marginBottom: 12 },
  slideSubtitle: { fontSize: 15, fontFamily: FONTS.regular, lineHeight: 24 },

  // Video
  mediaContainer: { borderRadius: 16, overflow: 'hidden' },
  videoPlaceholder: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  videoDuration: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    color: '#fff',
    fontSize: 12,
    fontFamily: FONTS.medium,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  videoControls: { padding: 12 },
  progressBar: { height: 4, borderRadius: 2, marginBottom: 10 },
  progressFill: { height: '100%', borderRadius: 2 },
  controlsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  timeText: { flex: 1, fontSize: 12, fontFamily: FONTS.regular },

  // Image
  imagePlaceholder: {
    height: 300,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    marginTop: 8,
    opacity: 0.6,
  },
});
