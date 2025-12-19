import type { ComponentProps, ReactNode } from 'react';
import { useMemo, useState } from 'react';

import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Avatar } from '../../components/ui/Avatar';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Screen } from '../../components/ui/Screen';
import { useTenantSettings } from '../../contexts/TenantSettingsContext';
import { useIsTablet } from '../../hooks/useIsTablet';
import { formatMoney } from '../../lib/format';

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
};

const heroImageUri =
  'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80';

function getGreeting(now = new Date()) {
  const hour = now.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
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

function RowHeader({
  title,
  icon,
  right,
}: {
  title: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  right?: ReactNode;
}) {
  return (
    <View style={styles.rowHeader}>
      <View style={styles.rowHeaderLeft}>
        <View style={styles.rowHeaderIcon}>
          <Ionicons name={icon} size={18} color={COLORS.slate900} />
        </View>
        <Text style={styles.rowHeaderTitle}>{title}</Text>
      </View>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

function StatTile({
  label,
  value,
  subtitle,
  icon,
  tint,
  bg,
  border,
}: {
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
        <View style={styles.statIconWrap}>
          <Ionicons name={icon} size={16} color={tint} />
        </View>
      </View>
      <Text style={styles.statValue}>{value}</Text>
      {subtitle ? <Text style={styles.statSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

function ChildChip({
  child,
  selected,
  onPress,
}: {
  child: Child;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.childChip,
        selected ? styles.childChipSelected : styles.childChipDefault,
      ]}
    >
      <Image source={{ uri: child.avatarUri }} style={styles.childChipAvatar} />
      <View style={{ flexShrink: 1 }}>
        <Text style={[styles.childChipName, selected ? styles.childChipNameSelected : null]} numberOfLines={1}>
          {child.name.split(' ')[0]}
        </Text>
        <Text style={[styles.childChipClass, selected ? styles.childChipClassSelected : null]} numberOfLines={1}>
          {child.classLevel}
        </Text>
      </View>
    </Pressable>
  );
}

export default function ParentHomeScreen() {
  const isTablet = useIsTablet();
  const { settings } = useTenantSettings();

  const [selectedChildId, setSelectedChildId] = useState<string>(mockChildren[0]?.id ?? '');
  const selectedChild = useMemo(
    () => mockChildren.find((c) => c.id === selectedChildId) ?? mockChildren[0],
    [selectedChildId]
  );
  const metrics = metricsByChild[selectedChild.id];

  const greeting = getGreeting();
  const todayLabel = new Intl.DateTimeFormat(settings.locale, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  const currentTermLabel = '2nd Term 2024';
  const feesDueFormatted = formatMoney(metrics.feesDue, settings.locale, settings.currency);

  return (
    <Screen padded={false} scroll={false} backgroundClassName="bg-slate-50">
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 112 }}>
        <LinearGradient
          colors={['#ffffff', '#f8fafc', '#eef2ff']}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.topRow}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.todayText}>{todayLabel}</Text>
              <Text style={styles.greetingText}>{greeting}</Text>
              <Text style={styles.schoolText} numberOfLines={1}>
                {settings.schoolName}
              </Text>
            </View>

            <View style={styles.iconRow}>
              <Pressable style={styles.iconButton}>
                <Ionicons name="notifications-outline" size={20} color={COLORS.slate900} />
              </Pressable>
              <Link href="/modal" asChild>
                <Pressable style={styles.iconButton}>
                  <Ionicons name="help-circle-outline" size={20} color={COLORS.slate900} />
                </Pressable>
              </Link>
            </View>
          </View>

          <View style={styles.pillsRow}>
            <Pill icon="shield-checkmark-outline" text="Parent Portal" />
            <Pill icon="calendar-outline" text={currentTermLabel} />
            <Pill icon="location-outline" text={settings.country} />
          </View>

          <Card style={{ padding: 16, marginTop: 14 }}>
            <RowHeader
              title="My Children"
              icon="people-outline"
              right={
                <Link href="/(tabs)/children">
                  <Text style={styles.linkText}>Open</Text>
                </Link>
              }
            />

            <View style={{ marginTop: 12 }}>
              {isTablet ? (
                <View style={styles.childGrid}>
                  {mockChildren.map((child) => (
                    <View key={child.id} style={styles.childGridItem}>
                      <ChildChip
                        child={child}
                        selected={child.id === selectedChildId}
                        onPress={() => setSelectedChildId(child.id)}
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingRight: 8 }}>
                  {mockChildren.map((child) => (
                    <ChildChip
                      key={child.id}
                      child={child}
                      selected={child.id === selectedChildId}
                      onPress={() => setSelectedChildId(child.id)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            <View style={styles.profileRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <Avatar name={mockUser.name} imageUri={mockUser.avatarUri} size={42} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={styles.profileName} numberOfLines={1}>
                    {mockUser.name}
                  </Text>
                  <Text style={styles.profileSub} numberOfLines={1}>
                    Viewing: {selectedChild.name} • {selectedChild.classLevel}
                  </Text>
                </View>
              </View>

              <Link href="/(tabs)/children" asChild>
                <Pressable style={styles.smallIconButton}>
                  <Ionicons name="person-outline" size={18} color={COLORS.slate900} />
                </Pressable>
              </Link>
            </View>

            <View style={styles.ctaRow}>
              <Link href="/(tabs)/fees" asChild>
                <Pressable style={[styles.ctaPrimary, { flex: 1 }]}>
                  <Ionicons name="card-outline" size={18} color="#fff" />
                  <Text style={styles.ctaPrimaryText}>Pay fees</Text>
                </Pressable>
              </Link>
              <Link href="/(tabs)/messages" asChild>
                <Pressable style={[styles.ctaSecondary, { flex: 1 }]}>
                  <Ionicons name="chatbubbles-outline" size={18} color={COLORS.slate900} />
                  <Text style={styles.ctaSecondaryText}>Message</Text>
                </Pressable>
              </Link>
            </View>

            <View style={styles.searchRow}>
              <Ionicons name="search-outline" size={18} color={COLORS.slate500} />
              <TextInput
                placeholder={`Search ${selectedChild.name.split(' ')[0]}'s fees, messages, results...`}
                placeholderTextColor={COLORS.slate400}
                style={styles.searchInput}
              />
            </View>
          </Card>
        </LinearGradient>

        <View style={styles.contentWrap}>
          {/* Stats */}
          {isTablet ? (
            <View style={styles.statsRow}>
              <StatTile label="Term Average" value={`${metrics.termAverage.toFixed(1)}%`} icon="trending-up-outline" tint={COLORS.blue600} bg={COLORS.blue50} border={COLORS.blue200} />
              <StatTile label="Position" value={`${metrics.classPosition}`} subtitle={`out of ${metrics.totalStudents}`} icon="trophy-outline" tint={COLORS.emerald600} bg={COLORS.emerald50} border={COLORS.emerald200} />
              <StatTile label="Attendance" value={`${Math.round(metrics.attendanceRate)}%`} icon="pie-chart-outline" tint={COLORS.violet600} bg={COLORS.violet50} border={COLORS.violet200} />
              <StatTile label="Conduct" value={metrics.conductGrade} icon="ribbon-outline" tint={COLORS.amber600} bg={COLORS.amber50} border={COLORS.amber200} />
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              <View style={styles.statsRow}>
                <StatTile label="Term Average" value={`${metrics.termAverage.toFixed(1)}%`} icon="trending-up-outline" tint={COLORS.blue600} bg={COLORS.blue50} border={COLORS.blue200} />
                <StatTile label="Position" value={`${metrics.classPosition}`} subtitle={`out of ${metrics.totalStudents}`} icon="trophy-outline" tint={COLORS.emerald600} bg={COLORS.emerald50} border={COLORS.emerald200} />
              </View>
              <View style={styles.statsRow}>
                <StatTile label="Attendance" value={`${Math.round(metrics.attendanceRate)}%`} icon="pie-chart-outline" tint={COLORS.violet600} bg={COLORS.violet50} border={COLORS.violet200} />
                <StatTile label="Conduct" value={metrics.conductGrade} icon="ribbon-outline" tint={COLORS.amber600} bg={COLORS.amber50} border={COLORS.amber200} />
              </View>
            </View>
          )}

          {/* Progress */}
          <Card style={{ marginTop: 16, overflow: 'hidden' }}>
            <View>
              <Image source={{ uri: heroImageUri }} style={styles.heroImage} resizeMode="cover" />
              <LinearGradient colors={['rgba(2,6,23,0.0)', 'rgba(2,6,23,0.55)']} style={styles.heroOverlay} />
              <View style={styles.heroBadges}>
                <View style={styles.heroBadge}>
                  <Image source={{ uri: selectedChild.avatarUri }} style={styles.heroBadgeAvatar} />
                  <Text style={styles.heroBadgeText}>{selectedChild.classLevel}</Text>
                </View>
                <View style={styles.heroBadge}>
                  <Text style={styles.heroBadgeText}>{settings.country}</Text>
                </View>
              </View>
            </View>

            <View style={{ padding: 16 }}>
              <RowHeader
                title="Progress overview"
                icon="analytics-outline"
                right={
                  <Link href="/(tabs)/children">
                    <Text style={styles.linkText}>View</Text>
                  </Link>
                }
              />
              <Text style={styles.sectionStrong}>{selectedChild.name.split(' ')[0]} • {currentTermLabel}</Text>
              <Text style={styles.sectionSub}>On track this week</Text>

              <View style={{ marginTop: 14 }}>
                <ProgressBar value={metrics.progressPct} />
                <View style={styles.progressMeta}>
                  <Text style={styles.progressLabel}>Weekly progress</Text>
                  <Text style={styles.progressValue}>{Math.round(metrics.progressPct * 100)}%</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* Fees + Messages */}
          <View style={[{ marginTop: 16 }, isTablet ? styles.twoCol : null]}>
            <Card style={[styles.sectionCard, isTablet ? styles.twoColItem : null]}>
              <RowHeader
                title="Fees due"
                icon="card-outline"
                right={
                  <Link href="/(tabs)/fees">
                    <Text style={styles.linkText}>Open</Text>
                  </Link>
                }
              />
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

            <Card style={[styles.sectionCard, isTablet ? styles.twoColItem : null]}>
              <RowHeader
                title="Messages"
                icon="mail-outline"
                right={
                  <Link href="/(tabs)/messages">
                    <Text style={styles.linkText}>View all</Text>
                  </Link>
                }
              />
              <View style={{ marginTop: 12, gap: 10 }}>
                <Pressable style={styles.messageRow}>
                  <Avatar name="Mrs. Nkechi Eze" imageUri="https://i.pravatar.cc/150?u=teacher-nkechi" size={34} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.messageTitle} numberOfLines={1}>
                      {selectedChild.name.split(' ')[0]}: Progress Update
                    </Text>
                    <Text style={styles.messageMeta} numberOfLines={1}>
                      Class Teacher • 2 hours ago
                    </Text>
                  </View>
                  <View style={styles.unreadDot}>
                    <Text style={styles.unreadDotText}>1</Text>
                  </View>
                </Pressable>

                <Pressable style={styles.messageRowAlt}>
                  <Avatar name="Admin Office" imageUri="https://i.pravatar.cc/150?u=admin-office" size={34} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={styles.messageTitle} numberOfLines={1}>
                      Fee Payment Reminder
                    </Text>
                    <Text style={styles.messageMeta} numberOfLines={1}>
                      {settings.schoolName} • 1 day ago
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={COLORS.slate400} />
                </Pressable>
              </View>
            </Card>
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>
    </Screen>
  );
}

const COLORS = {
  slate50: '#f8fafc',
  slate100: '#f1f5f9',
  slate200: '#e2e8f0',
  slate300: '#cbd5e1',
  slate400: '#94a3b8',
  slate500: '#64748b',
  slate600: '#475569',
  slate900: '#0f172a',

  blue50: '#eff6ff',
  blue200: 'rgba(191,219,254,0.8)',
  blue600: '#2563eb',

  emerald50: '#ecfdf5',
  emerald200: 'rgba(167,243,208,0.8)',
  emerald600: '#059669',

  violet50: '#f5f3ff',
  violet200: 'rgba(221,214,254,0.8)',
  violet600: '#7c3aed',

  amber50: '#fffbeb',
  amber200: 'rgba(253,230,138,0.8)',
  amber600: '#d97706',
};

const styles = StyleSheet.create({
  headerGradient: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18 },
  contentWrap: { paddingHorizontal: 20, paddingTop: 16 },

  topRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  todayText: { fontSize: 11, fontWeight: '600', color: COLORS.slate500 },
  greetingText: { marginTop: 4, fontSize: 24, lineHeight: 28, fontWeight: '800', color: COLORS.slate900 },
  schoolText: { marginTop: 4, fontSize: 12, fontWeight: '500', color: COLORS.slate600 },

  iconRow: { flexDirection: 'row', gap: 10 },
  iconButton: {
    height: 44,
    width: 44,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallIconButton: {
    height: 44,
    width: 44,
    borderRadius: 18,
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  pillsRow: { marginTop: 14, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.8)',
  },
  pillText: { fontSize: 11, fontWeight: '600', color: COLORS.slate600 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.7)',
  },

  rowHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  rowHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rowHeaderIcon: {
    height: 36,
    width: 36,
    borderRadius: 16,
    backgroundColor: COLORS.slate100,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowHeaderTitle: { fontSize: 16, fontWeight: '800', color: COLORS.slate900 },
  linkText: { fontSize: 12, fontWeight: '600', color: COLORS.slate600 },

  childGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  childGridItem: { width: '48%' },
  childChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 18,
    borderWidth: 1,
  },
  childChipDefault: { backgroundColor: '#fff', borderColor: 'rgba(226,232,240,0.8)' },
  childChipSelected: { backgroundColor: COLORS.slate900, borderColor: COLORS.slate900 },
  childChipAvatar: { height: 28, width: 28, borderRadius: 999 },
  childChipName: { fontSize: 12, fontWeight: '800', color: COLORS.slate900 },
  childChipNameSelected: { color: '#fff' },
  childChipClass: { marginTop: 1, fontSize: 10, fontWeight: '500', color: COLORS.slate500 },
  childChipClassSelected: { color: 'rgba(255,255,255,0.75)' },

  profileRow: { marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  profileName: { fontSize: 14, fontWeight: '800', color: COLORS.slate900 },
  profileSub: { marginTop: 2, fontSize: 11, fontWeight: '500', color: COLORS.slate500 },

  ctaRow: { marginTop: 14, flexDirection: 'row', gap: 10 },
  ctaPrimary: {
    height: 44,
    borderRadius: 18,
    backgroundColor: COLORS.slate900,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ctaPrimaryText: { fontSize: 14, fontWeight: '700', color: '#fff' },
  ctaSecondary: {
    height: 44,
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ctaSecondaryText: { fontSize: 14, fontWeight: '700', color: COLORS.slate900 },

  searchRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.9)',
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.slate900 },

  statsRow: { flexDirection: 'row', gap: 12 },
  statTile: { flex: 1, borderRadius: 18, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 12 },
  statTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { fontSize: 11, fontWeight: '600', color: COLORS.slate600 },
  statIconWrap: {
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: { marginTop: 8, fontSize: 18, fontWeight: '800', color: COLORS.slate900 },
  statSubtitle: { marginTop: 4, fontSize: 10, fontWeight: '500', color: COLORS.slate500 },

  heroImage: { height: 176, width: '100%' },
  heroOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 },
  heroBadges: { position: 'absolute', left: 12, right: 12, bottom: 12, flexDirection: 'row', justifyContent: 'space-between' },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.88)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  heroBadgeAvatar: { height: 20, width: 20, borderRadius: 999 },
  heroBadgeText: { fontSize: 11, fontWeight: '600', color: COLORS.slate900 },

  sectionStrong: { marginTop: 10, fontSize: 14, fontWeight: '800', color: COLORS.slate900 },
  sectionSub: { marginTop: 4, fontSize: 12, fontWeight: '500', color: COLORS.slate500 },
  progressMeta: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  progressLabel: { fontSize: 12, fontWeight: '600', color: COLORS.slate500 },
  progressValue: { fontSize: 12, fontWeight: '800', color: COLORS.slate900 },

  twoCol: { flexDirection: 'row', gap: 12 },
  twoColItem: { flex: 1 },

  sectionCard: { padding: 16, marginTop: 0 },
  mutedBox: {
    marginTop: 12,
    borderRadius: 18,
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.8)',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  mutedLabel: { fontSize: 11, fontWeight: '600', color: COLORS.slate500 },
  moneyText: { marginTop: 6, fontSize: 20, fontWeight: '800', color: COLORS.slate900 },
  dueRow: { marginTop: 10, flexDirection: 'row', alignItems: 'center', gap: 8 },
  duePill: { backgroundColor: COLORS.amber200, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 999 },
  duePillText: { fontSize: 10, fontWeight: '800', color: COLORS.amber600 },
  dueText: { fontSize: 11, fontWeight: '500', color: COLORS.slate500 },
  payButton: { paddingHorizontal: 16, paddingVertical: 12, backgroundColor: COLORS.slate900, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  payButtonText: { fontSize: 14, fontWeight: '700', color: '#fff' },

  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: COLORS.slate50,
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.8)',
    padding: 12,
  },
  messageRowAlt: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(226,232,240,0.8)',
    padding: 12,
  },
  messageTitle: { fontSize: 12, fontWeight: '800', color: COLORS.slate900 },
  messageMeta: { marginTop: 2, fontSize: 11, fontWeight: '500', color: COLORS.slate500 },
  unreadDot: { height: 24, width: 24, borderRadius: 999, backgroundColor: '#f43f5e', alignItems: 'center', justifyContent: 'center' },
  unreadDotText: { fontSize: 10, fontWeight: '800', color: '#fff' },
});


