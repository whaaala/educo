import type { ReactNode, RefObject } from 'react';
import {
  Modal as RNModal,
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import type { ScrollView as ScrollViewType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Shared fonts
const FONTS = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
};

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  icon?: ReactNode;
  iconBgColors?: readonly [string, string];
  children: ReactNode;
  footer?: ReactNode;
  showCloseButton?: boolean;
  preventBackdropClose?: boolean;
  scrollRef?: RefObject<ScrollViewType>;
}

export function Modal({
  visible,
  onClose,
  title,
  subtitle,
  icon,
  iconBgColors,
  children,
  footer,
  showCloseButton = true,
  preventBackdropClose = false,
  scrollRef,
}: ModalProps) {
  const { colors } = useTheme();

  // Default icon colors based on theme
  const defaultIconBgColors: readonly [string, string] = [colors.primary, colors.primaryDark];
  const actualIconBgColors = iconBgColors || defaultIconBgColors;

  return (
    <RNModal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable
          style={[styles.backdrop, { backgroundColor: colors.modalOverlay }]}
          onPress={preventBackdropClose ? undefined : onClose}
        />

        {/* Modal Content Container */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardView}
          pointerEvents="box-none"
        >
          <View style={styles.modalContainer} pointerEvents="box-none">
            <View style={[styles.modalContent, { backgroundColor: colors.modalBackground }]}>
              {/* Handle Bar */}
              <View style={styles.handleBarContainer}>
                <View style={[styles.handleBar, { backgroundColor: colors.border }]} />
              </View>

              {/* Header */}
              {(title || icon || showCloseButton) && (
                <View style={[styles.header, { borderBottomColor: colors.border }]}>
                  {/* Gradient Background */}
                  <LinearGradient
                    colors={[colors.modalHeaderGradientStart, colors.modalHeaderGradientEnd, colors.modalHeaderGradientStart]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.headerGradient}
                  />

                  {/* Header Content */}
                  <View style={styles.headerContent}>
                    <View style={styles.headerLeft}>
                      {icon && (
                        <LinearGradient
                          colors={actualIconBgColors}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                          style={styles.iconContainer}
                        >
                          {icon}
                        </LinearGradient>
                      )}
                      {(title || subtitle) && (
                        <View style={styles.headerTextContainer}>
                          {title && <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>}
                          {subtitle && <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
                        </View>
                      )}
                    </View>
                    {showCloseButton && (
                      <Pressable
                        onPress={onClose}
                        style={[styles.closeButton, { backgroundColor: colors.surface }]}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Ionicons name="close" size={20} color={colors.textMuted} />
                      </Pressable>
                    )}
                  </View>
                </View>
              )}

              {/* Body */}
              <ScrollView
                ref={scrollRef}
                style={styles.body}
                contentContainerStyle={styles.bodyContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                bounces={false}
              >
                {children}
              </ScrollView>

              {/* Footer */}
              {footer && (
                <View style={[styles.footer, { borderTopColor: colors.border, backgroundColor: colors.backgroundSecondary }]}>
                  {footer}
                </View>
              )}
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </RNModal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  modalContent: {
    borderRadius: 24,
    maxHeight: SCREEN_HEIGHT * 0.8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
    overflow: 'hidden',
  },
  handleBarContainer: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
  },
  header: {
    position: 'relative',
    borderBottomWidth: 1,
    overflow: 'hidden',
  },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
  },
  headerSubtitle: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    marginTop: 2,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  body: {
    flexShrink: 1,
  },
  bodyContent: {
    padding: 20,
    paddingBottom: 20,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
});

export default Modal;
