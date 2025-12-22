import { Text, View, StyleSheet } from 'react-native';
import { Screen } from '../components/ui/Screen';
import { useTheme } from '../contexts/ThemeContext';

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export default function ModalScreen() {
  const { colors } = useTheme();

  return (
    <Screen>
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Help</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          This is a placeholder modal.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: FONTS.medium,
  },
});


