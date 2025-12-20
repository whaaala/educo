import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ProgressBarProps {
  value: number;
  variant?: 'default' | 'success' | 'warning';
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, variant = 'default', size = 'md' }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value));
  const height = size === 'sm' ? 6 : 8;

  const gradientColors = {
    default: ['#334155', '#1e293b'] as const,
    success: ['#10b981', '#059669'] as const,
    warning: ['#f59e0b', '#d97706'] as const,
  };

  return (
    <View style={[styles.track, { height }]}>
      <LinearGradient
        colors={gradientColors[variant]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.fill, { width: `${pct * 100}%`, height }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: 999,
    backgroundColor: '#e8ecf0',
    overflow: 'hidden',
  },
  fill: {
    borderRadius: 999,
  },
});


