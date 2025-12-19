import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function SectionTitle({ title, right }: { title: string; right?: ReactNode }) {
  return (
    <View style={styles.row}>
      <Text style={styles.title}>{title}</Text>
      {right ? <View>{right}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
});


