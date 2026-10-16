import type { Href } from 'expo-router';
import { useRouter, usePathname } from 'expo-router';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';
import { activePlace, RAIL_WIDTH, SIDEBAR_WIDTH } from '@core/app-shell';
import { APP_PLACES, TAB_ICONS } from './BottomTabBar';

/**
 * THE RAIL AND THE SIDEBAR (A-2 change 3) — a tablet's navigation down the side, as Material's navigation rail and Apple's
 * sidebar: a RAIL (icon over its word) where windowClass says "rail", a SIDEBAR (icon beside its word, wider) where it says
 * "sidebar". The same places as the phone's bar (config/app-shell.json), the same active rule, the theme's colours.
 */
export default function NavRail({ expanded }: { expanded: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const active = activePlace(APP_PLACES, pathname);
  if (pathname.startsWith('/site-editor')) return null; // the website builder needs the whole screen; its own header leads back
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel="Main"
      style={[styles.rail, { width: expanded ? SIDEBAR_WIDTH : RAIL_WIDTH, paddingTop: insets.top + 12, paddingBottom: insets.bottom + 12, paddingLeft: insets.left, backgroundColor: colors.surface, borderRightColor: colors.border }]}
    >
      {APP_PLACES.map((p) => {
        const on = active?.id === p.id; const Icon = TAB_ICONS[p.icon];
        const tint = on ? colors.primary : colors.textSecondary;
        return (
          <Pressable
            key={p.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: on }}
            accessibilityLabel={p.label}
            onPress={() => router.push(p.href as Extract<Href, string>)}
            style={({ pressed }) => [styles.item, expanded && styles.itemExpanded, { opacity: pressed ? 0.7 : 1 }]}
          >
            <View style={[styles.pill, expanded && styles.pillExpanded, on && { backgroundColor: `${colors.primary}22` }]}>
              <Icon color={tint} size={22} filled={on} />
              {expanded && <Text style={[styles.label, styles.labelExpanded, { color: tint }]} numberOfLines={1}>{p.label}</Text>}
            </View>
            {!expanded && <Text style={[styles.label, styles.labelRail, { color: tint }]} numberOfLines={2}>{p.label}</Text>}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  rail: { borderRightWidth: StyleSheet.hairlineWidth, alignItems: 'stretch', gap: 4 },
  item: { alignItems: 'center', paddingVertical: 6, minHeight: 56 },
  itemExpanded: { alignItems: 'stretch', paddingHorizontal: 12, minHeight: 48 },
  pill: { width: 56, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  pillExpanded: { width: 'auto', height: 48, borderRadius: 24, flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 16, gap: 12 },
  label: { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 4 },
  labelExpanded: { fontSize: 15, marginTop: 0 },
  labelRail: { textAlign: 'center', paddingHorizontal: 4 }, // A2-22: two lines before a word is cut
});
