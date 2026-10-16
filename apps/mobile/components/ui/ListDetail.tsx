import type { Href } from 'expo-router';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';
import { useBarClearance, useWindowClass } from '@/hooks/useIsTablet';
import { LISTS, LIST_WIDTH, LIST_WORDS, WORDS, listView } from '@core/app-shell';

/**
 * THE LIST-DETAIL CONTAINER in the app (A-2 change 4) — the same rule as the web (`listView`, config/layout.json): ONE pane
 * on a phone (and a phone on its side) → the list, a row pushes its detail, Back (or Android's back) returns; TWO panes from
 * `listDetail.splitFrom` → the list beside the detail. One route per detail (`<base>/<id>`), so a deep link opens straight on
 * it. Every row is SAMPLE data (config/sample-lists.json) and says so.
 */
export default function ListDetail({ listId, base, openId }: { listId: string; base: string; openId: string | null }) {
  const router = useRouter();
  const { colors } = useTheme();
  const { panes } = useWindowClass();
  const clearance = useBarClearance();
  const list = LISTS[listId];
  const v = listView(list, openId, panes);
  const open = (id: string) => (panes === 2 ? router.replace : router.push)(`${base}/${id}` as Extract<Href, string>);
  const back = () => (router.canGoBack() ? router.back() : router.replace(base as Extract<Href, string>));
  const badge = (
    <Text style={[styles.badge, { color: colors.textSecondary, borderColor: colors.border, backgroundColor: colors.backgroundSecondary }]}>{WORDS.sample}</Text>
  );

  const listPane = (
    <ScrollView accessibilityLabel={list.label} style={panes === 2 ? [styles.listPane, { width: LIST_WIDTH, borderRightColor: colors.border }] : styles.flex} contentContainerStyle={{ paddingBottom: clearance }}>
      {v.missing && <Text accessibilityRole="alert" style={[styles.note, { color: colors.text, borderColor: colors.border }]}>{LIST_WORDS.missing}</Text>}
      {list.rows.length === 0 && <Text style={[styles.empty, { color: colors.textSecondary }]}>{LIST_WORDS.empty}</Text>}
      {list.rows.map((row) => {
        const on = panes === 2 && v.row?.id === row.id;
        return (
          <Pressable key={row.id} accessibilityRole="button" accessibilityLabel={`${row.title}, ${row.subtitle}`} accessibilityState={{ selected: on }}
            onPress={() => open(row.id)}
            // a plain style (A2-24: NativeWind's Pressable dropped a style FUNCTION — the row lost its layout); the press shows as a ripple
            android_ripple={{ color: colors.surfaceHover }}
            style={[styles.row, { borderBottomColor: colors.border, backgroundColor: on ? `${colors.primary}1a` : 'transparent' }]}>
            <View style={styles.flex}>
              <Text numberOfLines={1} style={[styles.title, { color: on ? colors.primary : colors.text }]}>{row.title}</Text>
              <Text numberOfLines={1} style={[styles.subtitle, { color: colors.textSecondary }]}>{row.subtitle}</Text>
            </View>
            {badge}
          </Pressable>
        );
      })}
    </ScrollView>
  );
  const detail = v.row ? (
    <ScrollView style={styles.flex} contentContainerStyle={[styles.detail, { paddingBottom: 16 + clearance }]}>
      {panes === 1 && (
        <Pressable accessibilityRole="button" accessibilityLabel={LIST_WORDS.back} onPress={back} style={styles.back} hitSlop={8}>
          <Ionicons name="arrow-back" size={20} color={colors.primary} />
          <Text style={[styles.backText, { color: colors.primary }]}>{LIST_WORDS.back}</Text>
        </Pressable>
      )}
      <View style={styles.titleRow}>
        <Text accessibilityRole="header" style={[styles.detailTitle, { color: colors.text }]}>{v.row.title}</Text>{badge}
      </View>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{v.row.subtitle}</Text>
      {v.row.fields.map((f) => (
        <View key={f.label} style={styles.field}>
          <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{f.label}</Text>
          <Text style={[styles.fieldValue, { color: colors.text }]}>{f.value}</Text>
        </View>
      ))}
    </ScrollView>
  ) : panes === 2 ? <Text style={[styles.empty, styles.flex, { color: colors.textSecondary }]}>{list.rows.length ? LIST_WORDS.select : ''}</Text> : null;

  if (v.show === 'list') return listPane;
  if (v.show === 'detail') return detail;
  return <View style={styles.split}>{listPane}{detail}</View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  split: { flex: 1, flexDirection: 'row' },
  listPane: { flexGrow: 0, borderRightWidth: StyleSheet.hairlineWidth },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, minHeight: 56, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontFamily: 'Inter_600SemiBold', fontSize: 16 },
  subtitle: { fontFamily: 'Inter_400Regular', fontSize: 14, marginTop: 2 },
  badge: { fontFamily: 'Inter_500Medium', fontSize: 11, borderWidth: 1, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2, overflow: 'hidden' },
  empty: { fontFamily: 'Inter_400Regular', fontSize: 15, padding: 24 },
  note: { fontFamily: 'Inter_500Medium', fontSize: 14, margin: 16, padding: 12, borderWidth: 1, borderRadius: 10 },
  detail: { padding: 16 },
  back: { flexDirection: 'row', alignItems: 'center', gap: 6, minHeight: 44, marginBottom: 8, alignSelf: 'flex-start' },
  backText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
  titleRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  detailTitle: { flex: 1, fontFamily: 'Inter_700Bold', fontSize: 22 },
  field: { marginTop: 16 },
  fieldLabel: { fontFamily: 'Inter_500Medium', fontSize: 13 },
  fieldValue: { fontFamily: 'Inter_400Regular', fontSize: 16, marginTop: 2 },
});
