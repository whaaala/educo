import { memo } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface BackButtonProps {
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CONFIG = {
  sm: { box: 32, icon: 18, radius: 8 },
  md: { box: 40, icon: 22, radius: 12 },
  lg: { box: 48, icon: 26, radius: 14 },
};

export const BackButton = memo(function BackButton({ onPress, size = 'md' }: BackButtonProps) {
  const { colors } = useTheme();
  const config = SIZE_CONFIG[size];

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          width: config.box,
          height: config.box,
          borderRadius: config.radius,
          backgroundColor: colors.border + '40',
        },
      ]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
    >
      <Ionicons name="chevron-back" size={config.icon} color={colors.text} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BackButton;
