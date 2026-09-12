import { memo, useState } from 'react';
import { Pressable, Dimensions, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

interface DriveFABProps {
  onPress: () => void;
}

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

export const DriveFAB = memo(function DriveFAB({ onPress }: DriveFABProps) {
  const { colors } = useTheme();
  const isTablet = useIsTablet();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.fab,
        isTablet ? styles.fabTablet : styles.fabMobile,
        { backgroundColor: colors.primary },
      ]}
    >
      <Ionicons name="add" size={26} color={colors.primaryText} />
    </Pressable>
  );
});

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 10,
  },
  fabMobile: {
    bottom: 96,
    right: 20,
  },
  fabTablet: {
    bottom: 96,
    right: 28,
  },
});

export default DriveFAB;
