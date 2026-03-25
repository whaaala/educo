import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

interface BreadcrumbSegment {
  id: string;
  name: string;
}

interface DriveBreadcrumbsProps {
  path: BreadcrumbSegment[];
  onNavigate: (id: string) => void;
  isTablet: boolean;
}

export function DriveBreadcrumbs({ path, onNavigate, isTablet }: DriveBreadcrumbsProps) {
  const { colors } = useTheme();

  if (path.length === 0) return null;

  return (
    <View style={[styles.wrapper, isTablet && styles.wrapperTablet]}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {path.map((segment, index) => {
          const isLast = index === path.length - 1;

          return (
            <View key={segment.id} style={styles.segmentRow}>
              {index > 0 && (
                <Ionicons
                  name="chevron-forward"
                  size={14}
                  color={colors.textMuted}
                  style={styles.chevron}
                />
              )}
              <Pressable
                onPress={() => !isLast && onNavigate(segment.id)}
                disabled={isLast}
                style={[
                  styles.segmentButton,
                  !isLast && styles.segmentButtonClickable,
                  !isLast && { backgroundColor: colors.backgroundSecondary },
                ]}
              >
                {index === 0 && (
                  <Ionicons
                    name="folder-open"
                    size={14}
                    color={isLast ? colors.primary : colors.textMuted}
                    style={styles.segmentIcon}
                  />
                )}
                <Text
                  style={[
                    styles.segmentText,
                    {
                      color: isLast ? colors.text : colors.textSecondary,
                      fontFamily: isLast ? FONTS.semiBold : FONTS.medium,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {segment.name}
                </Text>
              </Pressable>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  wrapperTablet: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginHorizontal: 4,
  },
  segmentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  segmentButtonClickable: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  segmentIcon: {
    marginRight: 4,
  },
  segmentText: {
    fontSize: 13,
    letterSpacing: -0.1,
  },
});

export default DriveBreadcrumbs;
