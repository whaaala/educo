import { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '../../contexts/ThemeContext';
import { ProfileAvatar } from './ProfileAvatar';
import { ChildSwitcher, type ChildData } from './ChildSwitcher';
import { BackButton } from './BackButton';

const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  // Child-related props
  children?: ChildData[];
  selectedChildId?: string;
  onSelectChild?: (childId: string) => void;
  showChildSwitcher?: boolean;
  // Avatar props
  showAvatar?: boolean;
  avatarUri?: string;
  avatarName?: string;
  avatarGradient?: 'purple' | 'green' | 'blue' | 'orange' | 'pink';
  // Badge props
  badge?: string;
  badgeIcon?: keyof typeof Ionicons.glyphMap;
  // Right action
  rightAction?: React.ReactNode;
}

export function PageHeader({
  title,
  showBackButton = true,
  onBackPress,
  children,
  selectedChildId,
  onSelectChild,
  showChildSwitcher = true,
  showAvatar = false,
  avatarUri,
  avatarName,
  avatarGradient = 'purple',
  badge,
  badgeIcon,
  rightAction,
}: PageHeaderProps) {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const isTablet = useIsTablet();

  const handleBack = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      router.back();
    }
  };

  const selectedChild = children?.find((c) => c.id === selectedChildId) || children?.[0];

  return (
    <View style={[styles.container, isTablet && styles.containerTablet, { backgroundColor: colors.background }]}>
      {/* Top Row: Back Button + Title + Right Action */}
      <View style={[styles.topRow, isTablet && styles.topRowTablet]}>
        {showBackButton && (
          <View style={styles.backButtonWrap}>
            <BackButton onPress={handleBack} size={isTablet ? 'lg' : 'md'} />
          </View>
        )}
        <Text
          style={[
            styles.title,
            isTablet && styles.titleTablet,
            { color: colors.text },
            !showBackButton && styles.titleNoBack,
          ]}
          numberOfLines={1}
        >
          {title}
        </Text>
        {rightAction || <View style={{ width: 40 }} />}
      </View>

      {/* Profile Row: Avatar + Info + Child Switcher */}
      {(showAvatar || (showChildSwitcher && children && children.length > 0)) && (
        <View style={[styles.profileRow, isTablet && styles.profileRowTablet]}>
          {/* Left side: Avatar and info */}
          <View style={styles.profileLeft}>
            {showAvatar && (
              <ProfileAvatar
                imageUri={avatarUri || selectedChild?.avatarUri}
                name={avatarName || selectedChild?.name}
                size={isTablet ? 'lg' : 'md'}
                gradient={avatarGradient}
                enlargeOnPress
              />
            )}
            {showAvatar && (
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, isTablet && styles.profileNameTablet, { color: colors.text }]}>
                  {selectedChild?.name || avatarName || title}
                </Text>
                {badge && (
                  <View style={[styles.badge, { backgroundColor: isDark ? colors.primaryLight : '#ecfdf5' }]}>
                    {badgeIcon && (
                      <Ionicons name={badgeIcon} size={isTablet ? 14 : 12} color={isDark ? colors.primary : '#059669'} />
                    )}
                    <Text style={[styles.badgeText, isTablet && styles.badgeTextTablet, { color: isDark ? colors.primary : '#059669' }]}>
                      {badge}
                    </Text>
                  </View>
                )}
                {!badge && selectedChild?.classLevel && (
                  <View style={[styles.classBadge, { backgroundColor: colors.primaryLight }]}>
                    <Ionicons name="school" size={isTablet ? 13 : 12} color={colors.primary} />
                    <Text style={[styles.classBadgeText, { color: colors.primary }]}>
                      {selectedChild.classLevel}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>

          {/* Right side: Child Switcher */}
          {showChildSwitcher && children && children.length > 1 && onSelectChild && selectedChildId && (
            <View style={styles.childSwitcherContainer}>
              <ChildSwitcher
                children={children}
                selectedChildId={selectedChildId}
                onSelectChild={onSelectChild}
                variant="compact"
                showClass
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 38,
    paddingBottom: 12,
  },
  containerTablet: {
    paddingHorizontal: 24,
    paddingTop: 58,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topRowTablet: {
    marginBottom: 12,
  },
  backButtonWrap: {
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 17,
    fontFamily: FONTS.bold,
  },
  titleTablet: {
    fontSize: 20,
  },
  titleNoBack: {
    marginLeft: 0,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  profileRowTablet: {
    marginTop: 12,
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileInfo: {
    marginLeft: 12,
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  profileNameTablet: {
    fontSize: 22,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 5,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  badgeTextTablet: {
    fontSize: 13,
  },
  classBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: 'flex-start',
    gap: 5,
  },
  classBadgeText: {
    fontSize: 12,
    fontFamily: FONTS.semiBold,
  },
  childSwitcherContainer: {
    marginLeft: 12,
    maxWidth: 200,
  },
});

export default PageHeader;
