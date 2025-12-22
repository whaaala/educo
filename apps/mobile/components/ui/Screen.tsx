import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../contexts/ThemeContext';

interface ScreenProps extends PropsWithChildren {
  padded?: boolean;
  scroll?: boolean;
}

export function Screen({
  children,
  padded = true,
  scroll = true,
}: ScreenProps) {
  const { colors } = useTheme();

  const content = (
    <View style={[styles.content, padded ? styles.padded : null]}>{children}</View>
  );

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]}>
      {scroll ? <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1 },
  padded: { paddingHorizontal: 16, paddingVertical: 16 },
});


