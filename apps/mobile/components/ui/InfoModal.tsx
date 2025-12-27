import type { ReactNode } from 'react';
import { useState } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

function useIsTablet() {
  const [isTablet] = useState(() => Dimensions.get('window').width >= 768);
  return isTablet;
}

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export type InfoModalType = 'error' | 'warning' | 'success' | 'info';

export interface InfoModalButton {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'primary' | 'destructive';
}

export interface InfoModalProps {
  visible: boolean;
  onClose: () => void;
  type?: InfoModalType;
  title: string;
  message: string;
  detail?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  buttons?: InfoModalButton[];
  children?: ReactNode;
}

const TYPE_CONFIG: Record<InfoModalType, {
  icon: keyof typeof Ionicons.glyphMap;
  colors: readonly [string, string];
  lightBg: string;
  darkBg: string;
}> = {
  error: {
    icon: 'close-circle',
    colors: ['#ef4444', '#dc2626'] as const,
    lightBg: '#fef2f2',
    darkBg: '#3f1515',
  },
  warning: {
    icon: 'warning',
    colors: ['#f59e0b', '#d97706'] as const,
    lightBg: '#fffbeb',
    darkBg: '#3f2f1f',
  },
  success: {
    icon: 'checkmark-circle',
    colors: ['#22c55e', '#16a34a'] as const,
    lightBg: '#f0fdf4',
    darkBg: '#14532d',
  },
  info: {
    icon: 'information-circle',
    colors: ['#3b82f6', '#2563eb'] as const,
    lightBg: '#eff6ff',
    darkBg: '#1e3a5f',
  },
};

export function InfoModal({
  visible,
  onClose,
  type = 'info',
  title,
  message,
  detail,
  icon,
  buttons = [{ text: 'OK', style: 'primary' }],
  children,
}: InfoModalProps) {
  const { colors, isDark } = useTheme();
  const isTablet = useIsTablet();
  const config = TYPE_CONFIG[type];

  const displayIcon = icon || config.icon;

  const handleButtonPress = (button: InfoModalButton) => {
    if (button.onPress) {
      button.onPress();
    }
    onClose();
  };

  const getButtonStyle = (style?: InfoModalButton['style']) => {
    switch (style) {
      case 'primary':
        return {
          bg: colors.primary,
          text: '#ffffff',
        };
      case 'destructive':
        return {
          bg: isDark ? '#7f1d1d' : '#fef2f2',
          text: isDark ? '#fca5a5' : '#dc2626',
        };
      default:
        return {
          bg: colors.backgroundTertiary,
          text: colors.textSecondary,
        };
    }
  };

  return (
    <RNModal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.modalOverlay }]}
          onPress={onClose}
        />

        {/* Modal Content */}
        <View style={isTablet ? styles.modalContainerTablet : styles.modalContainer}>
          <View style={[
            isTablet ? styles.modalContentTablet : styles.modalContent,
            { backgroundColor: colors.modalBackground }
          ]}>
            {/* Icon Section */}
            <View style={[styles.iconSection, { backgroundColor: isDark ? config.darkBg : config.lightBg }]}>
              {/* Decorative circles */}
              <View style={[styles.decorCircle1, { backgroundColor: config.colors[0], opacity: 0.1 }]} />
              <View style={[styles.decorCircle2, { backgroundColor: config.colors[1], opacity: 0.08 }]} />

              <LinearGradient
                colors={config.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconContainer}
              >
                <Ionicons name={displayIcon} size={32} color="#ffffff" />
              </LinearGradient>
            </View>

            {/* Content Section */}
            <View style={styles.contentSection}>
              <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
              <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>

              {detail && (
                <View style={[styles.detailBox, { backgroundColor: colors.backgroundTertiary, borderColor: colors.border }]}>
                  <Ionicons name="copy-outline" size={14} color={colors.textMuted} style={styles.detailIcon} />
                  <Text style={[styles.detailText, { color: colors.text }]} selectable>{detail}</Text>
                </View>
              )}

              {children}
            </View>

            {/* Buttons Section */}
            <View style={[styles.buttonsSection, { borderTopColor: colors.border }]}>
              {buttons.map((button, index) => {
                const buttonStyle = getButtonStyle(button.style);
                return (
                  <Pressable
                    key={index}
                    style={[
                      styles.button,
                      buttons.length === 1 && styles.buttonFullWidth,
                      { backgroundColor: buttonStyle.bg }
                    ]}
                    onPress={() => handleButtonPress(button)}
                  >
                    <Text style={[styles.buttonText, { color: buttonStyle.text }]}>{button.text}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  // Mobile styles
  modalContainer: {
    width: '100%',
    paddingHorizontal: 24,
    maxWidth: 340,
  },
  modalContent: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 24,
    overflow: 'hidden',
  },
  // Tablet styles
  modalContainerTablet: {
    width: '100%',
    maxWidth: 380,
    paddingHorizontal: 24,
  },
  modalContentTablet: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 24,
    overflow: 'hidden',
  },
  // Icon section
  iconSection: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    position: 'relative',
    overflow: 'hidden',
  },
  decorCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    top: -30,
    right: -30,
  },
  decorCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    bottom: -20,
    left: -20,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  // Content section
  contentSection: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
  detailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
    width: '100%',
  },
  detailIcon: {
    marginRight: 10,
  },
  detailText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    textAlign: 'center',
  },
  // Buttons section
  buttonsSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonFullWidth: {
    flex: 1,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
  },
});

export default InfoModal;
