import { memo } from 'react';
import { View, Text, Pressable, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const FONTS = {
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
};

export interface LoadMoreButtonProps {
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  text?: string;
  loadingText?: string;
  totalItems?: number;
  displayedItems?: number;
}

export const LoadMoreButton = memo(function LoadMoreButton({
  onPress,
  isLoading = false,
  disabled = false,
  text = 'Load More',
  loadingText = 'Loading...',
  totalItems,
  displayedItems,
}: LoadMoreButtonProps) {
  const { colors } = useTheme();

  // Nulling onPress alone left the Pressable still "pressable": it wasn't actually disabled, so
  // a press could still be dispatched to it, and screen readers never announced the disabled /
  // busy state. Mark it disabled properly and expose the a11y state.
  const isDisabled = isLoading || disabled;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={isDisabled ? undefined : onPress}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityState={{ disabled: isDisabled, busy: isLoading }}
        accessibilityLabel={isLoading ? loadingText : text}
        style={[
          styles.button,
          { backgroundColor: colors.primary },
          isDisabled && styles.buttonDisabled,
        ]}
      >
        <View style={styles.buttonInner}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Ionicons name="arrow-down-circle-outline" size={18} color="#ffffff" />
          )}
          <Text style={styles.buttonText}>
            {isLoading ? loadingText : text}
          </Text>
        </View>
      </Pressable>
      {totalItems !== undefined && displayedItems !== undefined && (
        <Text style={[styles.countText, { color: colors.textMuted }]}>
          Showing {displayedItems} of {totalItems}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  button: {
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: '#ffffff',
  },
  countText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
});

export default LoadMoreButton;
