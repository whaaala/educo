import type { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ScreenProps extends PropsWithChildren {
  padded?: boolean;
  scroll?: boolean;
  backgroundClassName?: string;
  contentClassName?: string;
}

export function Screen({
  children,
  padded = true,
  scroll = true,
  backgroundClassName = 'bg-white',
  contentClassName = '',
}: ScreenProps) {
  // NativeWind is not reliably active in this environment; keep props for compatibility,
  // but render using stable RN styles.
  const content = (
    <View style={[styles.content, padded ? styles.padded : null]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>{content}</ScrollView> : content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#ffffff' },
  scroll: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  content: { flex: 1 },
  padded: { paddingHorizontal: 16, paddingVertical: 16 },
});


