import { useState } from 'react';
import { View, Image, Pressable, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

type GradientPreset = 'purple' | 'green' | 'blue' | 'orange' | 'pink';

interface ProfileAvatarProps {
  imageUri?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  gradient?: GradientPreset;
  showOnlineIndicator?: boolean;
  enlargeOnPress?: boolean;
  onPress?: () => void;
}

const GRADIENT_COLORS: Record<GradientPreset, readonly [string, string, string?]> = {
  purple: ['#6366f1', '#8b5cf6', '#a855f7'],
  green: ['#10b981', '#059669'],
  blue: ['#3b82f6', '#2563eb'],
  orange: ['#f97316', '#ea580c'],
  pink: ['#ec4899', '#db2777'],
};

const SIZE_CONFIG = {
  sm: { outer: 44, inner: 38, ring: 3, online: 10 },
  md: { outer: 56, inner: 50, ring: 3, online: 14 },
  lg: { outer: 68, inner: 62, ring: 3, online: 16 },
  xl: { outer: 80, inner: 74, ring: 3, online: 18 },
};

export function ProfileAvatar({
  imageUri,
  name = '',
  size = 'md',
  gradient = 'purple',
  showOnlineIndicator = false,
  enlargeOnPress = true,
  onPress,
}: ProfileAvatarProps) {
  const { colors } = useTheme();
  const [isEnlarged, setIsEnlarged] = useState(false);
  const config = SIZE_CONFIG[size];
  const gradientColors = GRADIENT_COLORS[gradient] as [string, string] | [string, string, string];

  const initial = (name || '?').trim().charAt(0).toUpperCase();

  // Calculate enlarge transform based on size
  const getEnlargeTransform = () => {
    switch (size) {
      case 'sm':
        return [{ scale: 2.2 }, { translateX: 15 }, { translateY: 12 }];
      case 'md':
        return [{ scale: 2.5 }, { translateX: 20 }, { translateY: 15 }];
      case 'lg':
        return [{ scale: 2.5 }, { translateX: 23 }, { translateY: 18 }];
      case 'xl':
        return [{ scale: 2.5 }, { translateX: 27 }, { translateY: 20 }];
      default:
        return [{ scale: 2.5 }, { translateX: 20 }, { translateY: 15 }];
    }
  };

  const handlePressIn = () => {
    if (enlargeOnPress) {
      setIsEnlarged(true);
    }
  };

  const handlePressOut = () => {
    if (enlargeOnPress) {
      setIsEnlarged(false);
    }
  };

  const content = (
    <Animated.View
      style={[
        styles.avatarWrapper,
        isEnlarged && {
          transform: getEnlargeTransform(),
          zIndex: 1000,
          elevation: 20,
        },
      ]}
    >
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[
          styles.gradientRing,
          {
            width: config.outer,
            height: config.outer,
            borderRadius: config.outer / 2,
            padding: config.ring,
          },
        ]}
      >
        <View
          style={[
            styles.innerContainer,
            {
              backgroundColor: colors.background,
              borderRadius: (config.outer - config.ring * 2) / 2,
            },
          ]}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={[
                styles.image,
                {
                  width: config.inner,
                  height: config.inner,
                  borderRadius: config.inner / 2,
                },
              ]}
            />
          ) : (
            <View
              style={[
                styles.initialContainer,
                {
                  width: config.inner,
                  height: config.inner,
                  borderRadius: config.inner / 2,
                  backgroundColor: colors.primaryLight,
                },
              ]}
            >
              <Animated.Text
                style={[
                  styles.initialText,
                  {
                    color: colors.primary,
                    fontSize: config.inner * 0.4,
                  },
                ]}
              >
                {initial}
              </Animated.Text>
            </View>
          )}
        </View>
      </LinearGradient>

      {showOnlineIndicator && (
        <View
          style={[
            styles.onlineIndicator,
            {
              width: config.online,
              height: config.online,
              borderRadius: config.online / 2,
              borderWidth: config.online > 12 ? 3 : 2,
              borderColor: colors.background,
            },
          ]}
        />
      )}
    </Animated.View>
  );

  if (enlargeOnPress || onPress) {
    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onHoverIn={handlePressIn}
        onHoverOut={handlePressOut}
        onPress={onPress}
        style={styles.pressable}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  pressable: {
    zIndex: 1,
  },
  avatarWrapper: {
    position: 'relative',
  },
  gradientRing: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  initialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialText: {
    fontWeight: '700',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#22c55e',
  },
});

export default ProfileAvatar;
