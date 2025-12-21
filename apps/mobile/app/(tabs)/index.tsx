import type { ComponentProps, ReactNode } from 'react';
import { useMemo, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LeaveRequestModal } from '../../components/modals/LeaveRequestModal';
import { MessageTeacherModal } from '../../components/modals/MessageTeacherModal';
import { PayFeesModal } from '../../components/modals/PayFeesModal';
import { ViewResultsModal } from '../../components/modals/ViewResultsModal';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ============================================================================
// Types & Mock Data
// ============================================================================

interface Child {
  id: string;
  name: string;
  classLevel: string;
  avatarUri: string;
}

interface ChildMetrics {
  termAverage: number;
  classPosition: number;
  totalStudents: number;
  attendanceRate: number;
  conductGrade: string;
  progressPct: number;
  feesDue: number;
}

const mockUser = {
  name: 'Emeka Okonkwo',
  avatarUri: 'https://i.pravatar.cc/150?img=12',
};

const mockChildren: Child[] = [
  { id: 'child-001', name: 'Adaeze Okonkwo', classLevel: 'JSS 2', avatarUri: 'https://i.pravatar.cc/150?u=adaeze' },
  { id: 'child-002', name: 'Chukwuemeka Okonkwo', classLevel: 'SS 1', avatarUri: 'https://i.pravatar.cc/150?u=chukwuemeka' },
  // { id: 'child-003', name: 'Obioma Okonkwo', classLevel: 'JSS 1', avatarUri: 'https://i.pravatar.cc/150?u=obioma' },
  // { id: 'child-004', name: 'Kelechi Okonkwo', classLevel: 'Primary 6', avatarUri: 'https://i.pravatar.cc/150?u=kelechi' },
];

const metricsByChild: Record<string, ChildMetrics> = {
  'child-001': {
    termAverage: 78.5,
    classPosition: 5,
    totalStudents: 45,
    attendanceRate: 96.2,
    conductGrade: 'A',
    progressPct: 0.66,
    feesDue: 50000,
  },
  'child-002': {
    termAverage: 82.3,
    classPosition: 3,
    totalStudents: 52,
    attendanceRate: 94.5,
    conductGrade: 'A',
    progressPct: 0.72,
    feesDue: 65000,
  },
  'child-003': {
    termAverage: 85.1,
    classPosition: 2,
    totalStudents: 40,
    attendanceRate: 98.0,
    conductGrade: 'A',
    progressPct: 0.80,
    feesDue: 45000,
  },
  'child-004': {
    termAverage: 76.8,
    classPosition: 8,
    totalStudents: 35,
    attendanceRate: 92.5,
    conductGrade: 'B',
    progressPct: 0.58,
    feesDue: 35000,
  },
};

const heroImageUri = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';

// Mock Report History Data for each child
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

const reportsByChild: Record<string, ReportHistoryItem[]> = {
  'child-001': [
    { id: 'r1', examType: 'Third Term Exam', term: 'Term 3', year: '2024', totalPercentage: 72, rank: 9, totalStudents: 42, status: 'pass', datePublished: '2024-12-10' },
    { id: 'r2', examType: 'Second Term Exam', term: 'Term 2', year: '2024', totalPercentage: 68, rank: 12, totalStudents: 42, status: 'pass', datePublished: '2024-08-15' },
    { id: 'r3', examType: 'First Term Exam', term: 'Term 1', year: '2024', totalPercentage: 45, rank: 20, totalStudents: 42, status: 'fail', datePublished: '2024-04-12' },
  ],
  'child-002': [
    { id: 'r4', examType: 'Third Term Exam', term: 'Term 3', year: '2024', totalPercentage: 85, rank: 3, totalStudents: 52, status: 'pass', datePublished: '2024-12-10' },
    { id: 'r5', examType: 'Second Term Exam', term: 'Term 2', year: '2024', totalPercentage: 82, rank: 5, totalStudents: 52, status: 'pass', datePublished: '2024-08-15' },
    { id: 'r6', examType: 'First Term Exam', term: 'Term 1', year: '2024', totalPercentage: 78, rank: 7, totalStudents: 52, status: 'pass', datePublished: '2024-04-12' },
  ],
  'child-003': [
    { id: 'r7', examType: 'Third Term Exam', term: 'Term 3', year: '2024', totalPercentage: 88, rank: 2, totalStudents: 40, status: 'pass', datePublished: '2024-12-10' },
    { id: 'r8', examType: 'Second Term Exam', term: 'Term 2', year: '2024', totalPercentage: 84, rank: 4, totalStudents: 40, status: 'pass', datePublished: '2024-08-15' },
  ],
  'child-004': [
    { id: 'r9', examType: 'Third Term Exam', term: 'Term 3', year: '2024', totalPercentage: 75, rank: 8, totalStudents: 35, status: 'pass', datePublished: '2024-12-10' },
    { id: 'r10', examType: 'Second Term Exam', term: 'Term 2', year: '2024', totalPercentage: 62, rank: 15, totalStudents: 35, status: 'pass', datePublished: '2024-08-15' },
  ],
};

function getScoreColor(percentage: number) {
  if (percentage >= 70) return { bg: '#ecfdf5', text: '#059669', border: '#a7f3d0' };
  if (percentage >= 50) return { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' };
  return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
}

function formatShortDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

// ============================================================================
// Utility Functions
// ============================================================================

function getGreeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function formatMoney(amount: number, currency: string = 'NGN') {
  try {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₦${amount.toLocaleString()}`;
  }
}

function useIsTablet() {
  const [isTablet, setIsTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

// ============================================================================
// Reusable Components
// ============================================================================

function Avatar({ name, size = 40, imageUri }: { name: string; size?: number; imageUri?: string }) {
  const initial = (name || '?').trim().charAt(0).toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={{ width: size, height: size, borderRadius: size / 2 }} />
      ) : (
        <Text style={styles.avatarText}>{initial}</Text>
      )}
    </View>
  );
}

function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function Pill({ icon, text }: { icon: ComponentProps<typeof Ionicons>['name']; text: string }) {
  return (
    <View style={styles.pill}>
      <Ionicons name={icon} size={14} color={COLORS.slate600} />
      <Text style={styles.pillText}>{text}</Text>
    </View>
  );
}

function RowHeader({ title, icon, right }: { title: string; icon: ComponentProps<typeof Ionicons>['name']; right?: ReactNode }) {
  return (
    <View style={styles.rowHeader}>
      <View style={styles.rowHeaderLeft}>
        <View style={styles.rowHeaderIcon}>
          <Ionicons name={icon} size={16} color={COLORS.slate700} />
        </View>
        <Text style={styles.rowHeaderTitle}>{title}</Text>
      </View>
      {right}
    </View>
  );
}

function ProgressBar({ value }: { value: number }) {
  const pct = Math.max(0, Math.min(1, value));
  return (
    <View style={styles.progressTrack}>
      <LinearGradient
        colors={['#334155', '#1e293b']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.progressFill, { width: `${pct * 100}%` }]}
      />
    </View>
  );
}

function StatTile({ label, value, subtitle, icon, tint, bg, border }: {
  label: string;
  value: string;
  subtitle?: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  tint: string;
  bg: string;
  border: string;
}) {
  return (
    <View style={[styles.statTile, { backgroundColor: bg, borderColor: border }]}>
      <View style={styles.statTop}>
        <Text style={styles.statLabel}>{label}</Text>
        <View style={[styles.statIconWrap, { backgroundColor: `${tint}15` }]}>
          <Ionicons name={icon} size={14} color={tint} />
        </View>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle && <Text style={styles.statSubtitle}>{subtitle}</Text>}
    </View>
  );
}

// ============================================================================
// Mobile-specific Components
// ============================================================================

function MobileStatCard({ label, value, subtitle, icon, color }: {
  label: string;
  value: string;
  subtitle?: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  color: 'blue' | 'emerald' | 'violet' | 'amber';
}) {
  const colorMap = {
    blue: { bg: COLORS.blue50, border: COLORS.blue200, tint: COLORS.blue600, iconBg: COLORS.blue100 },
    emerald: { bg: COLORS.emerald50, border: COLORS.emerald200, tint: COLORS.emerald600, iconBg: COLORS.emerald100 },
    violet: { bg: COLORS.violet50, border: COLORS.violet200, tint: COLORS.violet600, iconBg: COLORS.violet100 },
    amber: { bg: COLORS.amber50, border: COLORS.amber200, tint: COLORS.amber600, iconBg: COLORS.amber100 },
  };
  const colors = colorMap[color];

  return (
    <View style={[mobileStyles.statCard, { backgroundColor: colors.bg, borderColor: colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text style={{ fontSize: 10, fontFamily: FONTS.semiBold, color: COLORS.slate600 }}>{label}</Text>
        <View style={{ height: 26, width: 26, borderRadius: 7, backgroundColor: colors.iconBg, alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name={icon} size={14} color={colors.tint} />
        </View>
      </View>
      <Text style={{ marginTop: 4, fontSize: 18, fontFamily: FONTS.bold, color: COLORS.slate900 }}>{value}</Text>
      {subtitle && <Text style={{ marginTop: 1, fontSize: 9, fontFamily: FONTS.medium, color: COLORS.slate500 }}>{subtitle}</Text>}
    </View>
  );
}

function MobileWidgetCard({ title, icon, linkHref, linkText, children }: {
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  linkHref: string;
  linkText: string;
  children: ReactNode;
}) {
  return (
    <View style={mobileStyles.widgetCard}>
      <View style={styles.rowHeader}>
        <View style={styles.rowHeaderLeft}>
          <View style={styles.rowHeaderIcon}>
            <Ionicons name={icon} size={16} color={COLORS.slate700} />
          </View>
          <Text style={styles.rowHeaderTitle}>{title}</Text>
        </View>
        <Link href={linkHref as any}>
          <Text style={styles.linkText}>{linkText}</Text>
        </Link>
      </View>
      {children}
    </View>
  );
}

function QuickActionTile({ icon, label, subtitle, onPress, color }: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  subtitle: string;
  onPress: () => void;
  color: 'blue' | 'emerald' | 'violet' | 'rose';
}) {
  const colorMap = {
    blue: { bg: '#fcfeff', iconBg: '#dbeafe', icon: '#2563eb', border: '#f0f5fa', subtitleColor: '#3b82f6' },
    emerald: { bg: '#fcfefd', iconBg: '#d1fae5', icon: '#059669', border: '#f0f7f4', subtitleColor: '#10b981' },
    violet: { bg: '#fcfcfe', iconBg: '#ede9fe', icon: '#7c3aed', border: '#f4f2f9', subtitleColor: '#8b5cf6' },
    rose: { bg: '#fefdfd', iconBg: '#ffe4e6', icon: '#e11d48', border: '#faf4f5', subtitleColor: '#f43f5e' },
  };
  const c = colorMap[color];

  return (
    <Pressable
      style={[mobileStyles.quickActionTile, { backgroundColor: c.bg, borderColor: c.border }]}
      onPress={onPress}
    >
      <View style={[mobileStyles.quickActionTileIcon, { backgroundColor: c.iconBg }]}>
        <Ionicons name={icon} size={22} color={c.icon} />
      </View>
      <Text style={mobileStyles.quickActionTileText}>{label}</Text>
      <Text style={[mobileStyles.quickActionTileSubtitle, { color: c.subtitleColor }]}>{subtitle}</Text>
    </Pressable>
  );
}

function TabletQuickActionTile({ icon, label, subtitle, onPress, color }: {
  icon: ComponentProps<typeof Ionicons>['name'];
  label: string;
  subtitle: string;
  onPress: () => void;
  color: 'blue' | 'emerald' | 'violet' | 'rose';
}) {
  const colorMap = {
    blue: { bg: '#fafcff', iconBg: '#dbeafe', icon: '#2563eb', border: '#e8f0fa', subtitleColor: '#3b82f6' },
    emerald: { bg: '#fafcfb', iconBg: '#d1fae5', icon: '#059669', border: '#e8f3ef', subtitleColor: '#10b981' },
    violet: { bg: '#fbfaff', iconBg: '#ede9fe', icon: '#7c3aed', border: '#eeebf6', subtitleColor: '#8b5cf6' },
    rose: { bg: '#fefafb', iconBg: '#ffe4e6', icon: '#e11d48', border: '#f6eced', subtitleColor: '#f43f5e' },
  };
  const c = colorMap[color];

  return (
    <Pressable
      style={[tabletStyles.quickActionTile, { backgroundColor: c.bg, borderColor: c.border }]}
      onPress={onPress}
    >
      <View style={[tabletStyles.quickActionTileIcon, { backgroundColor: c.iconBg }]}>
        <Ionicons name={icon} size={28} color={c.icon} />
      </View>
      <View style={tabletStyles.quickActionTileTextContainer}>
        <Text style={tabletStyles.quickActionTileText}>{label}</Text>
        <Text style={[tabletStyles.quickActionTileSubtitle, { color: c.subtitleColor }]}>{subtitle}</Text>
      </View>
    </Pressable>
  );
}

// ============================================================================
// Main Parent Home Screen
// ============================================================================

export default function ParentHomeScreen() {
  const isTablet = useIsTablet();
  const router = useRouter();
  const [selectedChildId, setSelectedChildId] = useState<string>(mockChildren[0]?.id ?? '');
  const childScrollRef = useRef<ScrollView>(null);

  // Modal states
  const [leaveModalVisible, setLeaveModalVisible] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [payFeesModalVisible, setPayFeesModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);

  // Navigate to reports history
  const handleViewAllReports = (childId?: string) => {
    router.push({
      pathname: '/reports',
      params: { childId, childName: selectedChild.name },
    });
  };

  // Calculate card width for scrolling
  const cardWidth = (SCREEN_WIDTH - 32) * 0.46;
  const cardMargin = 12;

  const handleSelectChild = (childId: string, index: number) => {
    setSelectedChildId(childId);
    // Scroll to the selected card
    if (childScrollRef.current && mockChildren.length > 2) {
      const scrollX = index * (cardWidth + cardMargin);
      childScrollRef.current.scrollTo({ x: scrollX, animated: true });
    }
  };

  const selectedChild = useMemo(
    () => mockChildren.find((c) => c.id === selectedChildId) ?? mockChildren[0],
    [selectedChildId]
  );
  const metrics = metricsByChild[selectedChild.id];

  const greeting = getGreeting();
  const todayLabel = new Intl.DateTimeFormat('en-NG', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const currentTermLabel = '2nd Term 2024';
  const feesDueFormatted = formatMoney(metrics.feesDue);

  // ============================================================================
  // MOBILE LAYOUT
  // ============================================================================
  if (!isTablet) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {/* Header with gradient */}
          <LinearGradient
            colors={['#ffffff', '#f8fafc', '#f0f4ff']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={mobileStyles.headerGradient}
          >
            {/* Top row - School name and Icons */}
            <View style={mobileStyles.headerTopRow}>
              <View style={mobileStyles.schoolBadge}>
                <View style={mobileStyles.schoolIconWrap}>
                  <Ionicons name="school" size={12} color={COLORS.white} />
                </View>
                <Text style={mobileStyles.schoolBadgeText}>Educo Demo School</Text>
              </View>
              <View style={mobileStyles.headerIconsRow}>
                <Pressable style={mobileStyles.headerIconBtn}>
                  <View style={{ position: 'relative' }}>
                    <Ionicons name="notifications-outline" size={20} color={COLORS.slate700} />
                    <View style={mobileStyles.notifBadge}>
                      <Text style={mobileStyles.notifBadgeText}>2</Text>
                    </View>
                  </View>
                </Pressable>
                <Link href="/modal" asChild>
                  <Pressable style={[mobileStyles.headerIconBtn, { marginLeft: 8 }]}>
                    <Ionicons name="help-circle-outline" size={20} color={COLORS.slate700} />
                  </Pressable>
                </Link>
              </View>
            </View>

            {/* Greeting row with parent info */}
            <View style={mobileStyles.greetingRow}>
              <View style={mobileStyles.greetingTextSection}>
                <Text style={mobileStyles.dateBadgeText}>{todayLabel}</Text>
                <View style={mobileStyles.greetingNameRow}>
                  <Text style={mobileStyles.greetingText}>{greeting}, </Text>
                  <Text style={mobileStyles.parentNameText}>{mockUser.name.split(' ')[0]}</Text>
                </View>
              </View>
              <Image
                source={{ uri: mockUser.avatarUri }}
                style={mobileStyles.parentAvatarImg}
                resizeMode="cover"
              />
            </View>

            {/* Child selector - Enhanced */}
            <View style={mobileStyles.childSelectorSection}>
              {/* Header - only show for multiple children */}
              {mockChildren.length > 1 && (
                <View style={mobileStyles.childSelectorHeader}>
                  <Text style={mobileStyles.childSelectorLabel}>Select child</Text>
                  {mockChildren.length > 2 && (
                    <View style={mobileStyles.paginationDots}>
                      {mockChildren.map((child, index) => (
                        <Pressable
                          key={child.id}
                          onPress={() => handleSelectChild(child.id, index)}
                          hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                          style={[
                            mobileStyles.paginationDot,
                            child.id === selectedChildId && mobileStyles.paginationDotActive,
                          ]}
                        />
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* === SINGLE CHILD LAYOUT === */}
              {mockChildren.length === 1 && (
                <View style={mobileStyles.singleChildContainer}>
                  {(() => {
                    const child = mockChildren[0];
                    return (
                      <View style={[mobileStyles.childCardBase, mobileStyles.singleChildCardSize, mobileStyles.childCardSelected]}>
                        <LinearGradient
                          colors={['#eef2ff', '#e0e7ff', '#dbeafe']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={mobileStyles.childCardGradient}
                        />
                        <View style={mobileStyles.childCardInner}>
                          <View style={mobileStyles.childAvatarContainer}>
                            <Image
                              source={{ uri: child.avatarUri }}
                              style={mobileStyles.childAvatarImg}
                              resizeMode="cover"
                            />
                            <View style={mobileStyles.childCheckBadge}>
                              <Ionicons name="checkmark" size={10} color={COLORS.white} />
                            </View>
                          </View>
                          <View style={mobileStyles.childTextContainer}>
                            <Text style={[mobileStyles.childNameText, mobileStyles.childNameTextSelected]} numberOfLines={1}>
                              {child.name.split(' ')[0]}
                            </Text>
                            <View style={[mobileStyles.childClassPill, mobileStyles.childClassPillSelected]}>
                              <Ionicons name="school-outline" size={10} color={COLORS.blue600} style={{ marginRight: 3 }} />
                              <Text style={[mobileStyles.childClassPillText, mobileStyles.childClassPillTextSelected]}>
                                {child.classLevel}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })()}
                </View>
              )}

              {/* === TWO CHILDREN LAYOUT === */}
              {mockChildren.length === 2 && (
                <View style={mobileStyles.twoChildrenContainer}>
                  {mockChildren.map((child) => {
                    const isSelected = child.id === selectedChildId;
                    return (
                      <Pressable
                        key={child.id}
                        onPress={() => setSelectedChildId(child.id)}
                        style={[
                          mobileStyles.childCardBase,
                          mobileStyles.twoChildCardSize,
                          isSelected ? mobileStyles.childCardSelected : mobileStyles.childCardDefault,
                        ]}
                      >
                        {isSelected && (
                          <LinearGradient
                            colors={['#eef2ff', '#e0e7ff', '#dbeafe']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={mobileStyles.childCardGradient}
                          />
                        )}
                        <View style={mobileStyles.childCardInner}>
                          <View style={mobileStyles.childAvatarContainer}>
                            <Image
                              source={{ uri: child.avatarUri }}
                              style={mobileStyles.childAvatarImg}
                              resizeMode="cover"
                            />
                            {isSelected && (
                              <View style={mobileStyles.childCheckBadge}>
                                <Ionicons name="checkmark" size={10} color={COLORS.white} />
                              </View>
                            )}
                          </View>
                          <View style={mobileStyles.childTextContainer}>
                            <Text
                              style={[mobileStyles.childNameText, isSelected && mobileStyles.childNameTextSelected]}
                              numberOfLines={1}
                            >
                              {child.name.split(' ')[0]}
                            </Text>
                            <View style={[mobileStyles.childClassPill, isSelected && mobileStyles.childClassPillSelected]}>
                              <Ionicons
                                name="school-outline"
                                size={10}
                                color={isSelected ? COLORS.blue600 : COLORS.slate500}
                                style={{ marginRight: 3 }}
                              />
                              <Text style={[mobileStyles.childClassPillText, isSelected && mobileStyles.childClassPillTextSelected]}>
                                {child.classLevel}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </View>
              )}

              {/* === MORE THAN TWO CHILDREN LAYOUT (with pagination) === */}
              {mockChildren.length > 2 && (
                <ScrollView
                  ref={childScrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={mobileStyles.multiChildScrollContent}
                  snapToInterval={(SCREEN_WIDTH - 32) * 0.48 + 12}
                  decelerationRate="fast"
                >
                  {mockChildren.map((child, index) => {
                    const isSelected = child.id === selectedChildId;
                    return (
                      <Pressable
                        key={child.id}
                        onPress={() => handleSelectChild(child.id, index)}
                        style={[
                          mobileStyles.childCardBase,
                          mobileStyles.multiChildCardSize,
                          isSelected ? mobileStyles.childCardSelected : mobileStyles.childCardDefault,
                          { marginRight: index === mockChildren.length - 1 ? 16 : 12 },
                        ]}
                      >
                        {isSelected && (
                          <LinearGradient
                            colors={['#eef2ff', '#e0e7ff', '#dbeafe']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 1 }}
                            style={mobileStyles.childCardGradient}
                          />
                        )}
                        <View style={mobileStyles.childCardInner}>
                          <View style={mobileStyles.childAvatarContainer}>
                            <Image
                              source={{ uri: child.avatarUri }}
                              style={mobileStyles.childAvatarImg}
                              resizeMode="cover"
                            />
                            {isSelected && (
                              <View style={mobileStyles.childCheckBadge}>
                                <Ionicons name="checkmark" size={10} color={COLORS.white} />
                              </View>
                            )}
                          </View>
                          <View style={mobileStyles.childTextContainer}>
                            <Text
                              style={[mobileStyles.childNameText, isSelected && mobileStyles.childNameTextSelected]}
                              numberOfLines={1}
                            >
                              {child.name.split(' ')[0]}
                            </Text>
                            <View style={[mobileStyles.childClassPill, isSelected && mobileStyles.childClassPillSelected]}>
                              <Ionicons
                                name="school-outline"
                                size={10}
                                color={isSelected ? COLORS.blue600 : COLORS.slate500}
                                style={{ marginRight: 3 }}
                              />
                              <Text style={[mobileStyles.childClassPillText, isSelected && mobileStyles.childClassPillTextSelected]}>
                                {child.classLevel}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              )}
            </View>
          </LinearGradient>

          {/* Quick Actions */}
          <View style={mobileStyles.quickActionsGrid}>
            <QuickActionTile icon="wallet-outline" label="Pay Fees" subtitle="Quick payment" onPress={() => setPayFeesModalVisible(true)} color="blue" />
            <QuickActionTile icon="mail-outline" label="Messages" subtitle="Chat with school" onPress={() => setMessageModalVisible(true)} color="emerald" />
            <QuickActionTile icon="school-outline" label="Results" subtitle="View grades" onPress={() => setResultsModalVisible(true)} color="violet" />
            <QuickActionTile icon="document-text-outline" label="Leave" subtitle="Request absence" onPress={() => setLeaveModalVisible(true)} color="rose" />
          </View>

          {/* Stats - 2x2 Grid */}
          <View style={{ marginTop: 14, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 13, fontFamily: FONTS.bold, color: COLORS.slate800 }}>{selectedChild.name.split(' ')[0]}'s Stats</Text>
              <Text style={{ fontSize: 11, fontFamily: FONTS.semiBold, color: COLORS.blue600 }}>{currentTermLabel}</Text>
            </View>
            <View style={mobileStyles.statsGrid}>
              {/* Average Card */}
              <View style={[mobileStyles.statsGridCard, { backgroundColor: '#ecfdf5', borderColor: '#a7f3d0' }]}>
                <View style={mobileStyles.statsGridCardTop}>
                  <Text style={[mobileStyles.statsGridCardLabel, { color: '#059669' }]}>Average</Text>
                  <View style={[mobileStyles.statsGridCardIcon, { backgroundColor: '#a7f3d0' }]}>
                    <Ionicons name="trending-up-outline" size={14} color="#059669" />
                  </View>
                </View>
                <Text style={[mobileStyles.statsGridCardValue, { color: '#064e3b' }]}>{metrics.termAverage.toFixed(1)}%</Text>
              </View>

              {/* Position Card */}
              <View style={[mobileStyles.statsGridCard, { backgroundColor: '#fef3c7', borderColor: '#fcd34d' }]}>
                <View style={mobileStyles.statsGridCardTop}>
                  <Text style={[mobileStyles.statsGridCardLabel, { color: '#d97706' }]}>Position</Text>
                  <View style={[mobileStyles.statsGridCardIcon, { backgroundColor: '#fcd34d' }]}>
                    <Ionicons name="trophy-outline" size={14} color="#d97706" />
                  </View>
                </View>
                <Text style={[mobileStyles.statsGridCardValue, { color: '#78350f' }]}>#{metrics.classPosition}</Text>
                <Text style={[mobileStyles.statsGridCardSubtext, { color: '#92400e' }]}>of {metrics.totalStudents}</Text>
              </View>

              {/* Attendance Card */}
              <View style={[mobileStyles.statsGridCard, { backgroundColor: '#eef2ff', borderColor: '#c7d2fe' }]}>
                <View style={mobileStyles.statsGridCardTop}>
                  <Text style={[mobileStyles.statsGridCardLabel, { color: '#6366f1' }]}>Attendance</Text>
                  <View style={[mobileStyles.statsGridCardIcon, { backgroundColor: '#c7d2fe' }]}>
                    <Ionicons name="pie-chart-outline" size={14} color="#6366f1" />
                  </View>
                </View>
                <Text style={[mobileStyles.statsGridCardValue, { color: '#1e1b4b' }]}>{Math.round(metrics.attendanceRate)}%</Text>
              </View>

              {/* Conduct Card */}
              <View style={[mobileStyles.statsGridCard, { backgroundColor: '#fce7f3', borderColor: '#f9a8d4' }]}>
                <View style={mobileStyles.statsGridCardTop}>
                  <Text style={[mobileStyles.statsGridCardLabel, { color: '#db2777' }]}>Conduct</Text>
                  <View style={[mobileStyles.statsGridCardIcon, { backgroundColor: '#f9a8d4' }]}>
                    <Ionicons name="ribbon-outline" size={14} color="#db2777" />
                  </View>
                </View>
                <Text style={[mobileStyles.statsGridCardValue, { color: '#831843' }]}>{metrics.conductGrade}</Text>
              </View>
            </View>
          </View>

          {/* Fees Due Widget */}
          <MobileWidgetCard title="Fees Due" icon="card-outline" linkHref="/(tabs)/fees" linkText="Pay now">
            <View style={styles.mutedBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.mutedLabel}>{selectedChild.name.split(' ')[0]} • School Fees</Text>
                <Text style={styles.moneyText}>{feesDueFormatted}</Text>
                <View style={styles.dueRow}>
                  <View style={styles.duePill}>
                    <Text style={styles.duePillText}>Due soon</Text>
                  </View>
                  <Text style={styles.dueText}>Due: 15 Feb</Text>
                </View>
              </View>
              <Link href="/(tabs)/fees" asChild>
                <Pressable style={styles.payButton}>
                  <Text style={styles.payButtonText}>Pay</Text>
                </Pressable>
              </Link>
            </View>
          </MobileWidgetCard>

          {/* Messages Widget */}
          <MobileWidgetCard title="Messages" icon="mail-outline" linkHref="/(tabs)/messages" linkText="View all">
            <View style={{ marginTop: 10 }}>
              <Pressable style={styles.messageRow}>
                <Avatar name="Mrs. Nkechi Eze" imageUri="https://i.pravatar.cc/150?u=teacher-nkechi" size={32} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.messageTitle}>{selectedChild.name.split(' ')[0]}: Progress Update</Text>
                  <Text style={styles.messageMeta}>Class Teacher • 2h ago</Text>
                </View>
                <View style={styles.unreadDot}>
                  <Text style={styles.unreadDotText}>1</Text>
                </View>
              </Pressable>
              <Pressable style={[styles.messageRow, { marginTop: 8, backgroundColor: COLORS.white }]}>
                <Avatar name="Admin Office" imageUri="https://i.pravatar.cc/150?u=admin-office" size={32} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.messageTitle}>Fee Payment Reminder</Text>
                  <Text style={styles.messageMeta}>Educo Demo School • 1d ago</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={COLORS.slate400} />
              </Pressable>
            </View>
          </MobileWidgetCard>

          {/* Progress Widget */}
          <MobileWidgetCard title="Progress" icon="analytics-outline" linkHref="/(tabs)/children" linkText="Details">
            <View style={{ marginTop: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={{ uri: selectedChild.avatarUri }} style={{ height: 36, width: 36, borderRadius: 10 }} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={{ fontSize: 13, fontFamily: FONTS.bold, color: COLORS.slate800 }}>{selectedChild.name.split(' ')[0]}</Text>
                  <Text style={{ fontSize: 11, fontFamily: FONTS.medium, color: COLORS.slate500 }}>On track this week</Text>
                </View>
                <Text style={{ fontSize: 16, fontFamily: FONTS.bold, color: COLORS.slate900 }}>{Math.round(metrics.progressPct * 100)}%</Text>
              </View>
              <View style={{ marginTop: 10 }}>
                <ProgressBar value={metrics.progressPct} />
              </View>
            </View>
          </MobileWidgetCard>

          {/* Report History Widget */}
          <MobileWidgetCard
            title="Report History"
            icon="document-text-outline"
            linkHref="/reports"
            linkText="View all"
          >
            <View style={{ marginTop: 10 }}>
              {(reportsByChild[selectedChild.id] || []).slice(0, 2).map((report, index) => {
                const scoreColors = getScoreColor(report.totalPercentage);
                return (
                  <Pressable
                    key={report.id}
                    style={[
                      mobileStyles.reportHistoryCard,
                      index > 0 && { marginTop: 10 }
                    ]}
                    onPress={() => handleViewAllReports(selectedChild.id)}
                  >
                    <View style={mobileStyles.reportHistoryCardHeader}>
                      <View style={mobileStyles.reportHistoryTermBadge}>
                        <Text style={mobileStyles.reportHistoryTermText}>{report.term}</Text>
                      </View>
                      <View style={[mobileStyles.reportHistoryScoreBadge, { backgroundColor: scoreColors.bg, borderColor: scoreColors.border }]}>
                        <Text style={[mobileStyles.reportHistoryScoreText, { color: scoreColors.text }]}>{report.totalPercentage}%</Text>
                      </View>
                    </View>
                    <Text style={mobileStyles.reportHistoryExamType}>{report.examType}</Text>
                    <View style={mobileStyles.reportHistoryMeta}>
                      <View style={mobileStyles.reportHistoryMetaItem}>
                        <Ionicons name="trophy-outline" size={12} color={COLORS.slate400} />
                        <Text style={mobileStyles.reportHistoryMetaText}>#{report.rank} of {report.totalStudents}</Text>
                      </View>
                      <View style={mobileStyles.reportHistoryMetaItem}>
                        <Ionicons name="calendar-outline" size={12} color={COLORS.slate400} />
                        <Text style={mobileStyles.reportHistoryMetaText}>{formatShortDate(report.datePublished)}</Text>
                      </View>
                      <View style={[
                        mobileStyles.reportHistoryStatusBadge,
                        { backgroundColor: report.status === 'pass' ? '#ecfdf5' : '#fef2f2' }
                      ]}>
                        <View style={[
                          mobileStyles.reportHistoryStatusDot,
                          { backgroundColor: report.status === 'pass' ? '#10b981' : '#ef4444' }
                        ]} />
                        <Text style={[
                          mobileStyles.reportHistoryStatusText,
                          { color: report.status === 'pass' ? '#059669' : '#dc2626' }
                        ]}>{report.status === 'pass' ? 'Passed' : 'Failed'}</Text>
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </MobileWidgetCard>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Modals */}
        <LeaveRequestModal
          visible={leaveModalVisible}
          onClose={() => setLeaveModalVisible(false)}
          childName={selectedChild.name}
        />
        <MessageTeacherModal
          visible={messageModalVisible}
          onClose={() => setMessageModalVisible(false)}
          childName={selectedChild.name}
          childClass={selectedChild.classLevel}
        />
        <PayFeesModal
          visible={payFeesModalVisible}
          onClose={() => setPayFeesModalVisible(false)}
          childName={selectedChild.name}
        />
        <ViewResultsModal
          visible={resultsModalVisible}
          onClose={() => setResultsModalVisible(false)}
          childName={selectedChild.name}
          childClass={selectedChild.classLevel}
          childId={selectedChild.id}
          onViewAllReports={handleViewAllReports}
        />
      </SafeAreaView>
    );
  }

  // ============================================================================
  // TABLET LAYOUT
  // ============================================================================
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={[COLORS.white, COLORS.slate50, '#f0f4ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={tabletStyles.headerGradient}
        >
          {/* Top row - School name, Pills and Icons */}
          <View style={tabletStyles.headerTopRow}>
            <View style={tabletStyles.schoolBadge}>
              <View style={tabletStyles.schoolIconWrap}>
                <Ionicons name="school" size={14} color={COLORS.white} />
              </View>
              <Text style={tabletStyles.schoolBadgeText}>Educo Demo School</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={styles.pillsRow}>
                <Pill icon="shield-checkmark-outline" text="Parent Portal" />
                <Pill icon="calendar-outline" text={currentTermLabel} />
              </View>
              <View style={[styles.iconRow, { marginLeft: 12 }]}>
                <Pressable style={styles.iconButton}>
                  <View style={{ position: 'relative' }}>
                    <Ionicons name="notifications-outline" size={18} color={COLORS.slate700} />
                    <View style={styles.notifDot} />
                  </View>
                </Pressable>
                <Link href="/modal" asChild>
                  <Pressable style={[styles.iconButton, { marginLeft: 8 }]}>
                    <Ionicons name="help-circle-outline" size={18} color={COLORS.slate700} />
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>

          {/* Greeting row with date and parent avatar */}
          <View style={tabletStyles.greetingRow}>
            <View style={{ flex: 1 }}>
              <Text style={tabletStyles.dateBadgeText}>{todayLabel}</Text>
              <View style={tabletStyles.greetingNameRow}>
                <Text style={tabletStyles.greetingText}>{greeting}, </Text>
                <Text style={tabletStyles.parentNameText}>{mockUser.name.split(' ')[0]}</Text>
              </View>
            </View>
            <Image
              source={{ uri: mockUser.avatarUri }}
              style={tabletStyles.parentAvatarImg}
              resizeMode="cover"
            />
          </View>

          {/* Child selector section - tablet optimized */}
          <View style={tabletStyles.childSelectorSection}>
            {/* Header - only show for multiple children */}
            {mockChildren.length > 1 && (
              <View style={tabletStyles.childSelectorHeader}>
                <Text style={tabletStyles.childSelectorLabel}>Select child</Text>
                {mockChildren.length > 2 && (
                  <View style={tabletStyles.paginationDots}>
                    {mockChildren.map((child, index) => (
                      <Pressable
                        key={child.id}
                        onPress={() => handleSelectChild(child.id, index)}
                        hitSlop={{ top: 10, bottom: 10, left: 5, right: 5 }}
                        style={[
                          tabletStyles.paginationDot,
                          child.id === selectedChildId && tabletStyles.paginationDotActive,
                        ]}
                      />
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* === SINGLE CHILD LAYOUT === */}
            {mockChildren.length === 1 && (
              <View style={tabletStyles.singleChildContainer}>
                {(() => {
                  const child = mockChildren[0];
                  return (
                    <View style={[tabletStyles.childCardBase, tabletStyles.singleChildCardSize, tabletStyles.childCardSelected]}>
                      <LinearGradient
                        colors={['#eef2ff', '#e0e7ff', '#dbeafe']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={tabletStyles.childCardGradient}
                      />
                      <View style={tabletStyles.childCardInner}>
                        <View style={tabletStyles.childAvatarContainer}>
                          <Image
                            source={{ uri: child.avatarUri }}
                            style={tabletStyles.childAvatarImg}
                            resizeMode="cover"
                          />
                          <View style={tabletStyles.childCheckBadge}>
                            <Ionicons name="checkmark" size={14} color={COLORS.white} />
                          </View>
                        </View>
                        <View style={tabletStyles.childTextContainer}>
                          <Text style={[tabletStyles.childNameText, tabletStyles.childNameTextSelected]} numberOfLines={1}>
                            {child.name.split(' ')[0]}
                          </Text>
                          <View style={[tabletStyles.childClassPill, tabletStyles.childClassPillSelected]}>
                            <Ionicons name="school-outline" size={13} color={COLORS.blue600} style={{ marginRight: 5 }} />
                            <Text style={[tabletStyles.childClassPillText, tabletStyles.childClassPillTextSelected]}>
                              {child.classLevel}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })()}
              </View>
            )}

            {/* === TWO CHILDREN LAYOUT === */}
            {mockChildren.length === 2 && (
              <View style={tabletStyles.twoChildrenContainer}>
                {mockChildren.map((child) => {
                  const isSelected = child.id === selectedChildId;
                  return (
                    <Pressable
                      key={child.id}
                      onPress={() => setSelectedChildId(child.id)}
                      style={[
                        tabletStyles.childCardBase,
                        tabletStyles.twoChildCardSize,
                        isSelected ? tabletStyles.childCardSelected : tabletStyles.childCardDefault,
                      ]}
                    >
                      {isSelected && (
                        <LinearGradient
                          colors={['#eef2ff', '#e0e7ff', '#dbeafe']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={tabletStyles.childCardGradient}
                        />
                      )}
                      <View style={tabletStyles.childCardInner}>
                        <View style={tabletStyles.childAvatarContainer}>
                          <Image
                            source={{ uri: child.avatarUri }}
                            style={tabletStyles.childAvatarImg}
                            resizeMode="cover"
                          />
                          {isSelected && (
                            <View style={tabletStyles.childCheckBadge}>
                              <Ionicons name="checkmark" size={14} color={COLORS.white} />
                            </View>
                          )}
                        </View>
                        <View style={tabletStyles.childTextContainer}>
                          <Text
                            style={[tabletStyles.childNameText, isSelected && tabletStyles.childNameTextSelected]}
                            numberOfLines={1}
                          >
                            {child.name.split(' ')[0]}
                          </Text>
                          <View style={[tabletStyles.childClassPill, isSelected && tabletStyles.childClassPillSelected]}>
                            <Ionicons
                              name="school-outline"
                              size={13}
                              color={isSelected ? COLORS.blue600 : COLORS.slate500}
                              style={{ marginRight: 5 }}
                            />
                            <Text style={[tabletStyles.childClassPillText, isSelected && tabletStyles.childClassPillTextSelected]}>
                              {child.classLevel}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* === MORE THAN TWO CHILDREN LAYOUT === */}
            {mockChildren.length > 2 && (
              <ScrollView
                ref={childScrollRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={tabletStyles.multiChildScrollContent}
                snapToInterval={240 + 20}
                decelerationRate="fast"
              >
                {mockChildren.map((child, index) => {
                  const isSelected = child.id === selectedChildId;
                  return (
                    <Pressable
                      key={child.id}
                      onPress={() => handleSelectChild(child.id, index)}
                      style={[
                        tabletStyles.childCardBase,
                        tabletStyles.multiChildCardSize,
                        isSelected ? tabletStyles.childCardSelected : tabletStyles.childCardDefault,
                        { marginRight: index === mockChildren.length - 1 ? 0 : 20 },
                      ]}
                    >
                      {isSelected && (
                        <LinearGradient
                          colors={['#eef2ff', '#e0e7ff', '#dbeafe']}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={tabletStyles.childCardGradient}
                        />
                      )}
                      <View style={tabletStyles.childCardInner}>
                        <View style={tabletStyles.childAvatarContainer}>
                          <Image
                            source={{ uri: child.avatarUri }}
                            style={tabletStyles.childAvatarImg}
                            resizeMode="cover"
                          />
                          {isSelected && (
                            <View style={tabletStyles.childCheckBadge}>
                              <Ionicons name="checkmark" size={14} color={COLORS.white} />
                            </View>
                          )}
                        </View>
                        <View style={tabletStyles.childTextContainer}>
                          <Text
                            style={[tabletStyles.childNameText, isSelected && tabletStyles.childNameTextSelected]}
                            numberOfLines={1}
                          >
                            {child.name.split(' ')[0]}
                          </Text>
                          <View style={[tabletStyles.childClassPill, isSelected && tabletStyles.childClassPillSelected]}>
                            <Ionicons
                              name="school-outline"
                              size={13}
                              color={isSelected ? COLORS.blue600 : COLORS.slate500}
                              style={{ marginRight: 5 }}
                            />
                            <Text style={[tabletStyles.childClassPillText, isSelected && tabletStyles.childClassPillTextSelected]}>
                              {child.classLevel}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>

          {/* Quick Actions - Tablet */}
          <View style={tabletStyles.quickActionsGrid}>
            <TabletQuickActionTile icon="wallet-outline" label="Pay Fees" subtitle="Quick payment" onPress={() => setPayFeesModalVisible(true)} color="blue" />
            <TabletQuickActionTile icon="mail-outline" label="Messages" subtitle="Chat with school" onPress={() => setMessageModalVisible(true)} color="emerald" />
            <TabletQuickActionTile icon="school-outline" label="Results" subtitle="View grades" onPress={() => setResultsModalVisible(true)} color="violet" />
            <TabletQuickActionTile icon="document-text-outline" label="Leave" subtitle="Request absence" onPress={() => setLeaveModalVisible(true)} color="rose" />
          </View>
        </LinearGradient>

        <View style={tabletStyles.contentWrap}>
          {/* 4-column stats grid */}
          <View style={styles.statsRow}>
            <StatTile label="Term Average" value={`${metrics.termAverage.toFixed(1)}%`} icon="trending-up-outline" tint={COLORS.blue600} bg={COLORS.blue50} border={COLORS.blue200} />
            <StatTile label="Position" value={`#${metrics.classPosition}`} subtitle={`of ${metrics.totalStudents}`} icon="trophy-outline" tint={COLORS.emerald600} bg={COLORS.emerald50} border={COLORS.emerald200} />
            <StatTile label="Attendance" value={`${Math.round(metrics.attendanceRate)}%`} icon="pie-chart-outline" tint={COLORS.violet600} bg={COLORS.violet50} border={COLORS.violet200} />
            <StatTile label="Conduct" value={metrics.conductGrade} icon="ribbon-outline" tint={COLORS.amber600} bg={COLORS.amber50} border={COLORS.amber200} />
          </View>

          {/* Two-column widget grid */}
          <View style={styles.twoCol}>
            {/* Fees Due Widget */}
            <Card style={[styles.sectionCard, styles.twoColItem, { marginTop: 14 }]}>
              <RowHeader title="Fees Due" icon="card-outline" right={<Link href="/(tabs)/fees"><Text style={styles.linkText}>View all</Text></Link>} />
              <View style={styles.mutedBox}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.mutedLabel}>{selectedChild.name.split(' ')[0]} • School Fees</Text>
                  <Text style={styles.moneyText}>{feesDueFormatted}</Text>
                  <View style={styles.dueRow}>
                    <View style={styles.duePill}>
                      <Text style={styles.duePillText}>Due soon</Text>
                    </View>
                    <Text style={styles.dueText}>Due: 15 Feb</Text>
                  </View>
                </View>
                <Link href="/(tabs)/fees" asChild>
                  <Pressable style={styles.payButton}>
                    <Text style={styles.payButtonText}>Pay</Text>
                  </Pressable>
                </Link>
              </View>
            </Card>

            {/* Messages Widget */}
            <Card style={[styles.sectionCard, styles.twoColItem, { marginTop: 14 }]}>
              <RowHeader title="Messages" icon="mail-outline" right={<Link href="/(tabs)/messages"><Text style={styles.linkText}>View all</Text></Link>} />
              <View style={{ marginTop: 10 }}>
                <Pressable style={styles.messageRow}>
                  <Avatar name="Mrs. Nkechi Eze" imageUri="https://i.pravatar.cc/150?u=teacher-nkechi" size={32} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.messageTitle}>{selectedChild.name.split(' ')[0]}: Progress Update</Text>
                    <Text style={styles.messageMeta}>Class Teacher • 2h ago</Text>
                  </View>
                  <View style={styles.unreadDot}>
                    <Text style={styles.unreadDotText}>1</Text>
                  </View>
                </Pressable>
                <Pressable style={[styles.messageRow, { marginTop: 8, backgroundColor: COLORS.white }]}>
                  <Avatar name="Admin Office" imageUri="https://i.pravatar.cc/150?u=admin-office" size={32} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.messageTitle}>Fee Payment Reminder</Text>
                    <Text style={styles.messageMeta}>Educo Demo School • 1d ago</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={COLORS.slate400} />
                </Pressable>
              </View>
            </Card>
          </View>

          {/* Report History Section - Full width */}
          <Card style={{ marginTop: 14, padding: 16 }}>
            <RowHeader
              title="Report History"
              icon="document-text-outline"
              right={
                <Pressable onPress={() => handleViewAllReports(selectedChild.id)}>
                  <Text style={styles.linkText}>View all</Text>
                </Pressable>
              }
            />
            <View style={tabletStyles.reportHistoryGrid}>
              {(reportsByChild[selectedChild.id] || []).slice(0, 3).map((report) => {
                const scoreColors = getScoreColor(report.totalPercentage);
                return (
                  <Pressable
                    key={report.id}
                    style={tabletStyles.reportHistoryCard}
                    onPress={() => handleViewAllReports(selectedChild.id)}
                  >
                    <View style={tabletStyles.reportHistoryCardHeader}>
                      <View style={tabletStyles.reportHistoryTermBadge}>
                        <Text style={tabletStyles.reportHistoryTermText}>{report.term}</Text>
                      </View>
                      <View style={[tabletStyles.reportHistoryScoreBadge, { backgroundColor: scoreColors.bg, borderColor: scoreColors.border }]}>
                        <Text style={[tabletStyles.reportHistoryScoreText, { color: scoreColors.text }]}>{report.totalPercentage}%</Text>
                      </View>
                    </View>
                    <Text style={tabletStyles.reportHistoryExamType}>{report.examType}</Text>
                    <View style={tabletStyles.reportHistoryMeta}>
                      <View style={tabletStyles.reportHistoryMetaItem}>
                        <Ionicons name="trophy-outline" size={14} color={COLORS.slate400} />
                        <Text style={tabletStyles.reportHistoryMetaText}>#{report.rank} of {report.totalStudents}</Text>
                      </View>
                      <View style={tabletStyles.reportHistoryMetaItem}>
                        <Ionicons name="calendar-outline" size={14} color={COLORS.slate400} />
                        <Text style={tabletStyles.reportHistoryMetaText}>{formatShortDate(report.datePublished)}</Text>
                      </View>
                    </View>
                    <View style={tabletStyles.reportHistoryFooter}>
                      <View style={[
                        tabletStyles.reportHistoryStatusBadge,
                        { backgroundColor: report.status === 'pass' ? '#ecfdf5' : '#fef2f2' }
                      ]}>
                        <View style={[
                          tabletStyles.reportHistoryStatusDot,
                          { backgroundColor: report.status === 'pass' ? '#10b981' : '#ef4444' }
                        ]} />
                        <Text style={[
                          tabletStyles.reportHistoryStatusText,
                          { color: report.status === 'pass' ? '#059669' : '#dc2626' }
                        ]}>{report.status === 'pass' ? 'Passed' : 'Failed'}</Text>
                      </View>
                      <View style={tabletStyles.reportHistoryViewDetails}>
                        <Text style={tabletStyles.reportHistoryViewDetailsText}>View</Text>
                        <Ionicons name="chevron-forward" size={14} color={COLORS.blue600} />
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          </Card>

          {/* Progress Overview - Full width */}
          <Card style={{ marginTop: 14, overflow: 'hidden' }}>
            <View>
              <Image source={{ uri: heroImageUri }} style={styles.heroImage} resizeMode="cover" />
              <LinearGradient colors={['rgba(2,6,23,0.0)', 'rgba(2,6,23,0.5)']} style={styles.heroOverlay} />
              <View style={styles.heroBadges}>
                <View style={styles.heroBadge}>
                  <Image source={{ uri: selectedChild.avatarUri }} style={styles.heroBadgeAvatar} />
                  <Text style={styles.heroBadgeText}>{selectedChild.classLevel}</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>Nigeria</Text>
                </View>
              </View>
            </View>
            <View style={{ padding: 16 }}>
              <RowHeader title="Progress Overview" icon="analytics-outline" right={<Link href="/(tabs)/children"><Text style={styles.linkText}>View details</Text></Link>} />
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sectionStrong}>{selectedChild.name.split(' ')[0]} • {currentTermLabel}</Text>
                  <Text style={styles.sectionSub}>On track this week</Text>
                </View>
                <Text style={{ fontSize: 24, fontFamily: FONTS.bold, color: COLORS.slate900 }}>{Math.round(metrics.progressPct * 100)}%</Text>
              </View>
              <View style={{ marginTop: 12 }}>
                <ProgressBar value={metrics.progressPct} />
                <View style={styles.progressMeta}>
                  <Text style={styles.progressLabel}>Weekly progress</Text>
                  <Text style={styles.progressValue}>{Math.round(metrics.progressPct * 100)}%</Text>
                </View>
              </View>
            </View>
          </Card>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>

      {/* Modals */}
      <LeaveRequestModal
        visible={leaveModalVisible}
        onClose={() => setLeaveModalVisible(false)}
        childName={selectedChild.name}
      />
      <MessageTeacherModal
        visible={messageModalVisible}
        onClose={() => setMessageModalVisible(false)}
        childName={selectedChild.name}
        childClass={selectedChild.classLevel}
      />
      <PayFeesModal
        visible={payFeesModalVisible}
        onClose={() => setPayFeesModalVisible(false)}
        childName={selectedChild.name}
      />
      <ViewResultsModal
        visible={resultsModalVisible}
        onClose={() => setResultsModalVisible(false)}
        childName={selectedChild.name}
        childClass={selectedChild.classLevel}
        childId={selectedChild.id}
        onViewAllReports={handleViewAllReports}
      />
    </SafeAreaView>
  );
}

// ============================================================================
// Color Palette
// ============================================================================

// Font family constants
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
  extraBold: 'Inter_800ExtraBold',
};

const COLORS = {
  slate50: '#fafbfc',
  slate100: '#f4f6f8',
  slate200: '#e8ecf0',
  slate300: '#d1d9e0',
  slate400: '#9ba8b4',
  slate500: '#6b7a88',
  slate600: '#4a5568',
  slate700: '#334155',
  slate800: '#1e293b',
  slate900: '#0f172a',
  blue50: '#f0f7ff',
  blue100: '#e0efff',
  blue200: '#bfdbfe',
  blue500: '#3b82f6',
  blue600: '#2563eb',
  blue700: '#1d4ed8',
  emerald50: '#f0fdf6',
  emerald100: '#dcfce7',
  emerald200: '#a7f3d0',
  emerald500: '#10b981',
  emerald600: '#059669',
  violet50: '#f7f5ff',
  violet100: '#ede9fe',
  violet200: '#ddd6fe',
  violet500: '#8b5cf6',
  violet600: '#7c3aed',
  amber50: '#fffcf0',
  amber100: '#fef3c7',
  amber200: '#fde68a',
  amber500: '#f59e0b',
  amber600: '#d97706',
  rose50: '#fff5f7',
  rose500: '#f43f5e',
  rose600: '#e11d48',
  white: '#ffffff',
};

// ============================================================================
// Styles
// ============================================================================

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.white },

  // Header
  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  todayText: { fontSize: 11, fontFamily: FONTS.medium, color: COLORS.slate500 },
  greetingText: { marginTop: 2, fontSize: 22, fontFamily: FONTS.bold, color: COLORS.slate900 },
  schoolText: { marginTop: 3, fontSize: 12, fontFamily: FONTS.medium, color: COLORS.slate500 },

  iconRow: { flexDirection: 'row' },
  iconButton: {
    height: 42,
    width: 42,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: -4,
    right: -4,
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: COLORS.rose500,
  },

  // Pills
  pillsRow: { flexDirection: 'row' },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: COLORS.slate100,
    marginRight: 6,
  },
  pillText: { fontSize: 10, fontFamily: FONTS.semiBold, color: COLORS.slate600, marginLeft: 5 },

  // Card
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  // Row headers
  rowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  rowHeaderIcon: {
    height: 32,
    width: 32,
    borderRadius: 8,
    backgroundColor: COLORS.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowHeaderTitle: { fontSize: 15, fontFamily: FONTS.bold, color: COLORS.slate800 },
  linkText: { fontSize: 12, fontFamily: FONTS.semiBold, color: COLORS.blue600 },

  // Child chips
  childGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1.5,
    marginRight: 8,
  },
  childChipDefault: { backgroundColor: COLORS.white, borderColor: COLORS.slate200 },
  childChipSelected: { backgroundColor: COLORS.slate900, borderColor: COLORS.slate900 },
  childChipAvatar: { height: 26, width: 26, borderRadius: 8, marginRight: 8 },
  childChipName: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.slate800 },
  childChipNameSelected: { color: COLORS.white },
  childChipClass: { marginTop: 1, fontSize: 10, fontFamily: FONTS.medium, color: COLORS.slate500 },
  childChipClassSelected: { color: 'rgba(255,255,255,0.7)' },

  // Profile row
  profileRow: { marginTop: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileName: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.slate800 },
  profileSub: { marginTop: 2, fontSize: 11, fontFamily: FONTS.medium, color: COLORS.slate500 },

  // CTA buttons
  ctaPrimary: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: COLORS.slate900,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaPrimaryText: { fontSize: 13, fontFamily: FONTS.semiBold, color: COLORS.white, marginLeft: 6 },
  ctaSecondary: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaSecondaryText: { fontSize: 13, fontFamily: FONTS.semiBold, color: COLORS.slate700, marginLeft: 6 },

  // Search
  searchRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  searchInput: { flex: 1, fontSize: 13, fontFamily: FONTS.regular, color: COLORS.slate700, marginLeft: 10 },

  // Stats
  statsRow: { flexDirection: 'row' },
  statTile: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginRight: 10,
  },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { fontSize: 10, fontFamily: FONTS.semiBold, color: COLORS.slate600 },
  statIconWrap: {
    height: 28,
    width: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { marginTop: 6, fontSize: 20, fontFamily: FONTS.bold, color: COLORS.slate900 },
  statSubtitle: { marginTop: 2, fontSize: 10, fontFamily: FONTS.medium, color: COLORS.slate500 },

  // Hero image
  heroImage: { height: 160, width: '100%' },
  heroOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  heroBadges: { position: 'absolute', left: 12, right: 12, bottom: 12, flexDirection: 'row', justifyContent: 'space-between' },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  heroBadgeAvatar: { height: 18, width: 18, borderRadius: 6, marginRight: 6 },
  heroBadgeText: { fontSize: 10, fontFamily: FONTS.semiBold, color: COLORS.slate800 },

  // Section text
  sectionStrong: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.slate800 },
  sectionSub: { marginTop: 2, fontSize: 12, fontFamily: FONTS.medium, color: COLORS.slate500 },

  // Progress
  progressTrack: { height: 8, backgroundColor: COLORS.slate200, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  progressMeta: { marginTop: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressLabel: { fontSize: 11, fontFamily: FONTS.semiBold, color: COLORS.slate500 },
  progressValue: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.slate800 },

  // Two column layout
  twoCol: { flexDirection: 'row' },
  twoColItem: { flex: 1, marginRight: 10 },

  // Section cards
  sectionCard: { padding: 14 },
  mutedBox: {
    marginTop: 10,
    borderRadius: 14,
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  mutedLabel: { fontSize: 10, fontFamily: FONTS.semiBold, color: COLORS.slate500 },
  moneyText: { marginTop: 4, fontSize: 18, fontFamily: FONTS.bold, color: COLORS.slate900 },
  dueRow: { marginTop: 8, flexDirection: 'row', alignItems: 'center' },
  duePill: { backgroundColor: COLORS.amber100, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  duePillText: { fontSize: 9, fontFamily: FONTS.bold, color: COLORS.amber600 },
  dueText: { fontSize: 10, fontFamily: FONTS.medium, color: COLORS.slate500, marginLeft: 6 },
  payButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: COLORS.slate900,
    borderRadius: 10,
  },
  payButtonText: { fontSize: 12, fontFamily: FONTS.semiBold, color: COLORS.white },

  // Messages
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    padding: 10,
  },
  messageTitle: { fontSize: 12, fontFamily: FONTS.bold, color: COLORS.slate800 },
  messageMeta: { marginTop: 1, fontSize: 10, fontFamily: FONTS.medium, color: COLORS.slate500 },
  unreadDot: {
    height: 20,
    width: 20,
    borderRadius: 6,
    backgroundColor: COLORS.rose500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unreadDotText: { fontSize: 9, fontFamily: FONTS.bold, color: COLORS.white },

  // Avatar
  avatar: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.slate200,
    borderWidth: 1,
    borderColor: COLORS.slate200,
  },
  avatarText: { fontSize: 14, fontFamily: FONTS.bold, color: COLORS.slate700 },
});

// ============================================================================
// Mobile-specific styles
// ============================================================================

const mobileStyles = StyleSheet.create({
  headerGradient: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 16 },

  // Header top row (date + icons)
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerIconsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // School badge at top
  schoolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolIconWrap: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.blue500,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  schoolBadgeText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.slate700,
  },

  // Greeting row
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    marginBottom: 6,
  },
  greetingTextSection: {
    flex: 1,
  },

  // Date text
  dateBadgeText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.slate600,
    marginBottom: 4,
  },

  // Greeting + name row
  greetingNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  greetingText: { fontSize: 18, fontFamily: FONTS.medium, color: COLORS.slate500 },
  parentNameText: { fontSize: 18, fontFamily: FONTS.bold, color: COLORS.slate900 },

  // Parent avatar in header
  parentAvatarImg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.slate100,
  },

  // Header icons
  headerIconBtn: {
    height: 44,
    width: 44,
    borderRadius: 14,
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.slate100,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  notifBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    height: 18,
    width: 18,
    borderRadius: 9,
    backgroundColor: COLORS.rose500,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  notifBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },

  // Child selector section
  childSelectorSection: {
    marginTop: 20,
  },
  childSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  childSelectorLabel: {
    fontSize: 13,
    fontFamily: FONTS.bold,
    color: COLORS.slate700,
    letterSpacing: -0.2,
  },
  childSelectorLink: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.blue600,
  },

  // Pagination dots
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.slate300,
  },
  paginationDotActive: {
    width: 20,
    backgroundColor: COLORS.blue500,
    borderRadius: 4,
  },

  // Single child container (centered)
  singleChildContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },

  // Two children container (centered with gap)
  twoChildrenContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },

  // Multi-child scroll container (3+ children)
  multiChildScrollContent: {
    paddingHorizontal: 0,
    paddingVertical: 8,
  },

  // ========== NEW CARD STYLES ==========
  // Base card style (shared by all)
  childCardBase: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },

  // Size for single-child layout
  singleChildCardSize: {
    width: (SCREEN_WIDTH - 56) / 2,
    minWidth: 160,
  },

  // Size for two-child layout
  twoChildCardSize: {
    width: (SCREEN_WIDTH - 56) / 2,
    minWidth: 150,
  },

  // Size for multi-child layout
  multiChildCardSize: {
    width: (SCREEN_WIDTH - 32) * 0.46,
    minWidth: 155,
  },

  // Default (unselected) card state
  childCardDefault: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },

  // Selected card state
  childCardSelected: {
    backgroundColor: COLORS.blue50,
    borderWidth: 2,
    borderColor: COLORS.blue500,
    shadowColor: COLORS.blue500,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },

  // Gradient overlay for selected card
  childCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 14,
  },

  // Inner content container
  childCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  // Avatar container with checkmark positioning
  childAvatarContainer: {
    position: 'relative',
    width: 48,
    height: 48,
  },

  // Avatar image
  childAvatarImg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.slate100,
  },

  // Checkmark badge on avatar
  childCheckBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.blue500,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  // Text container (name + class)
  childTextContainer: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },

  // Child name text
  childNameText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.slate800,
  },
  childNameTextSelected: {
    color: COLORS.blue700,
  },

  // Class pill/badge
  childClassPill: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.slate100,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  childClassPillSelected: {
    backgroundColor: COLORS.blue100,
  },

  // Class text inside pill
  childClassPillText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.slate500,
  },
  childClassPillTextSelected: {
    color: COLORS.blue600,
  },

  // Legacy single child styles (keeping for backwards compat)
  singleChildCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.slate200,
    borderRadius: 16,
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  singleChildAvatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    backgroundColor: COLORS.slate100,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: COLORS.slate200,
  },
  singleChildInfo: {
    flex: 1,
    marginLeft: 14,
  },
  singleChildName: {
    fontSize: 17,
    fontFamily: FONTS.bold,
    color: COLORS.slate800,
  },
  singleChildClassBadge: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.slate100,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  singleChildClassText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.slate600,
  },

  statCard: {
    width: (SCREEN_WIDTH - 48) / 2,
    minWidth: 140,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginRight: 8,
  },

  // Quick Actions Grid
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginTop: 16,
  },
  quickActionTile: {
    width: (SCREEN_WIDTH - 24 - 24) / 4,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  quickActionTileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 6,
  },
  quickActionTileText: {
    fontSize: 11,
    fontFamily: FONTS.bold,
    color: COLORS.slate800,
    textAlign: 'center',
    marginBottom: 2,
  },
  quickActionTileSubtitle: {
    fontSize: 9,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },

  widgetCard: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    padding: 14,
  },

  // Stats Grid Styles (2x2 layout)
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statsGridCard: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 14,
    borderWidth: 1,
  },
  statsGridCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  statsGridCardLabel: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  statsGridCardIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsGridCardValue: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    letterSpacing: -0.5,
  },
  statsGridCardSubtext: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },

  // Report History Widget Styles
  reportHistoryCard: {
    backgroundColor: COLORS.slate50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    padding: 12,
  },
  reportHistoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  reportHistoryTermBadge: {
    backgroundColor: COLORS.slate200,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  reportHistoryTermText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
    color: COLORS.slate600,
  },
  reportHistoryScoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  reportHistoryScoreText: {
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
  reportHistoryExamType: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.slate800,
    marginBottom: 8,
  },
  reportHistoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 10,
  },
  reportHistoryMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportHistoryMetaText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    color: COLORS.slate500,
  },
  reportHistoryStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 4,
  },
  reportHistoryStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  reportHistoryStatusText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },
});

// ============================================================================
// Tablet-specific styles
// ============================================================================

const tabletStyles = StyleSheet.create({
  headerGradient: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 18 },
  contentWrap: { paddingHorizontal: 24, paddingTop: 16 },

  // Top row with school badge and icons
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  // School badge
  schoolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  schoolIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.blue500,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  schoolBadgeText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.slate700,
  },

  // Greeting row
  greetingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dateBadgeText: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.slate600,
    marginBottom: 4,
  },
  greetingNameRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  greetingText: {
    fontSize: 26,
    fontFamily: FONTS.medium,
    color: COLORS.slate500,
  },
  parentNameText: {
    fontSize: 26,
    fontFamily: FONTS.bold,
    color: COLORS.slate900,
  },
  parentAvatarImg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.slate100,
  },

  // Child selector section
  childSelectorSection: {
    marginTop: 24,
  },
  childSelectorHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  childSelectorLabel: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.slate700,
    letterSpacing: -0.3,
  },

  // Pagination dots - sleek pill style
  paginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.slate100,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.slate300,
  },
  paginationDotActive: {
    width: 28,
    height: 8,
    backgroundColor: COLORS.blue500,
    borderRadius: 4,
  },

  // Single child container (centered)
  singleChildContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },

  // Two children container (centered with gap)
  twoChildrenContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
    paddingVertical: 12,
  },

  // Multi-child scroll container (3+ children)
  multiChildScrollContent: {
    paddingVertical: 12,
  },

  // Base card style (shared by all) - larger, more spacious for tablet
  childCardBase: {
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },

  // Size for single-child layout (tablet) - wider card
  singleChildCardSize: {
    minWidth: 280,
  },

  // Size for two-child layout (tablet)
  twoChildCardSize: {
    minWidth: 260,
  },

  // Size for multi-child layout (tablet)
  multiChildCardSize: {
    minWidth: 260,
  },

  // Default (unselected) card state - refined shadows
  childCardDefault: {
    backgroundColor: COLORS.white,
    borderWidth: 1.5,
    borderColor: COLORS.slate200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },

  // Selected card state - vibrant with stronger shadow
  childCardSelected: {
    backgroundColor: COLORS.blue50,
    borderWidth: 2.5,
    borderColor: COLORS.blue500,
    shadowColor: COLORS.blue500,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 6,
  },

  // Gradient overlay for selected card
  childCardGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 18,
  },

  // Inner content container - more padding for tablet
  childCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },

  // Avatar container with checkmark positioning - larger for tablet
  childAvatarContainer: {
    position: 'relative',
    width: 64,
    height: 64,
  },

  // Avatar image - larger, more rounded
  childAvatarImg: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.slate100,
  },

  // Checkmark badge on avatar - larger, more prominent
  childCheckBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.blue500,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    shadowColor: COLORS.blue500,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },

  // Text container (name + class) - more spacing
  childTextContainer: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },

  // Child name text - larger for tablet
  childNameText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.slate800,
    letterSpacing: -0.3,
  },
  childNameTextSelected: {
    color: COLORS.blue700,
  },

  // Class pill/badge - more refined
  childClassPill: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: COLORS.slate100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  childClassPillSelected: {
    backgroundColor: COLORS.blue100,
  },

  // Class text inside pill - slightly larger
  childClassPillText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
    color: COLORS.slate500,
  },
  childClassPillTextSelected: {
    color: COLORS.blue600,
  },

  // Quick Actions Grid - Tablet
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 16,
  },
  quickActionTile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  quickActionTileIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTileTextContainer: {
    flex: 1,
    marginLeft: 14,
  },
  quickActionTileText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.slate800,
  },
  quickActionTileSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },

  // Report History Styles - Tablet
  reportHistoryGrid: {
    flexDirection: 'row',
    marginTop: 14,
    gap: 14,
  },
  reportHistoryCard: {
    flex: 1,
    backgroundColor: COLORS.slate50,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.slate200,
    padding: 14,
  },
  reportHistoryCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportHistoryTermBadge: {
    backgroundColor: COLORS.slate200,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  reportHistoryTermText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
    color: COLORS.slate600,
  },
  reportHistoryScoreBadge: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
  },
  reportHistoryScoreText: {
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
  reportHistoryExamType: {
    fontSize: 15,
    fontFamily: FONTS.bold,
    color: COLORS.slate800,
    marginBottom: 10,
  },
  reportHistoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  reportHistoryMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  reportHistoryMetaText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.slate500,
  },
  reportHistoryFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.slate200,
  },
  reportHistoryStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  reportHistoryStatusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  reportHistoryStatusText: {
    fontSize: 11,
    fontFamily: FONTS.semiBold,
  },
  reportHistoryViewDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reportHistoryViewDetailsText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
    color: COLORS.blue600,
  },
});
