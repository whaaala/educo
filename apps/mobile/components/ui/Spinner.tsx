import { memo, useEffect, useRef } from 'react';
import { View, Animated, Easing, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../contexts/ThemeContext';

const FONTS = {
  medium: 'Inter_500Medium',
};

export interface SpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  inline?: boolean;
}

const SIZE_CONFIG = {
  sm: { icon: 20, container: 32, pulse: 40, textSize: 12 },
  md: { icon: 28, container: 48, pulse: 56, textSize: 14 },
  lg: { icon: 36, container: 64, pulse: 72, textSize: 16 },
};

export const Spinner = memo(function Spinner({
  message = 'Loading...',
  size = 'md',
  inline = false,
}: SpinnerProps) {
  const { colors } = useTheme();
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.4)).current;

  const config = SIZE_CONFIG[size];

  useEffect(() => {
    const spin = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    spin.start();
    pulse.start();

    return () => {
      spin.stop();
      pulse.stop();
    };
  }, [rotateAnim, pulseAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[styles.wrapper, !inline && styles.wrapperFull]}>
      <View style={styles.iconArea}>
        {/* Pulsing background circle */}
        <Animated.View
          style={[
            styles.pulseCircle,
            {
              width: config.pulse,
              height: config.pulse,
              borderRadius: config.pulse / 2,
              backgroundColor: colors.primaryLight,
              opacity: pulseAnim,
            },
          ]}
        />
        {/* Spinning icon */}
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons
            name="sync"
            size={config.icon}
            color={colors.primary}
          />
        </Animated.View>
      </View>

      {message && (
        <Animated.Text
          style={[
            styles.message,
            {
              fontSize: config.textSize,
              color: colors.textMuted,
              opacity: pulseAnim,
            },
          ]}
        >
          {message}
        </Animated.Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  wrapperFull: {
    flex: 1,
    minHeight: 200,
  },
  iconArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulseCircle: {
    position: 'absolute',
  },
  message: {
    marginTop: 16,
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
});

export default Spinner;
